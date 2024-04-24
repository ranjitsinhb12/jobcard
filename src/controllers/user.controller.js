import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User, UserLocation, Roles } from "../models/user.model.js";
import {Company, Location} from "../models/company.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { Op } from "sequelize";
import bcrypt from "bcrypt"
import { options } from "../constants.js";



const generateAccessAndRefreshTokens = async(UserId) => {
    try {
        const user = await User.findByPk(UserId)
        const accessToken = jwt.sign(
            {
                UserId: user.UserId,

            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        )
        
        const refreshToken = jwt.sign(
        {
            UserId: user.UserId,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
        )
            
        // const accessToken = User.generateAccessToken(UserId)
        // const refreshToken = User.generateRefreshToken(UserId)
        user.set({
            RefreshToken: refreshToken
        })
        
        await user.save()

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, error)
    }
}

const registerUser = asyncHandler(async (req, res) =>{
    
    const { FullName, UserMobile, UserEmail, UserName, UserPassword, LocationId, RoleId, CompanyId, IsWorking, PayRates, PayMethod} = req.body

    // check if not null or empty
    if(
        [FullName, UserMobile, UserEmail, UserName, UserPassword, PayRates, PayMethod].some((field)=> field.trim() === "")
    ){
        throw new ApiError(400, "All fields are required!")
    }

    // Check Location Id
    if(LocationId.length <= 0){
        throw new ApiError(400, "Location is Mandatory Field")
    }

    if(RoleId.length <=0){
        throw new ApiError(400, "Please select role!!")
    }

    if(CompanyId <= 0){
        throw new ApiError(400, "Please select Company!!")
    }

    // Check if User already registered
    const existedUser = await User.findOne({
        where:{
           [Op.or]:  [{UserName: UserName}, {UserEmail: UserEmail}]
        }    
    })

    if(existedUser){
        throw new ApiError(400, "User Already Exist!")
    }

    // get Uploaded local image path
    let avatarLocalPath;
    if(req.files && Array.isArray(req.files.Avatar) && req.files.Avatar.length > 0){
        avatarLocalPath = req.files.Avatar[0].path
    }

    // if Avatar local path not found
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required!")
    }

    // Upload to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    // Check if image uploaded sucessfully or not
     if(!avatar){
         throw new ApiError(400, "Avatar image is required!")
     }
    
     // Has password
    const hashUserPassword = await bcrypt.hash(UserPassword, 10)

    // Create User 
    const user = await User.create({
        FullName,
        Avatar: avatar?.url || "",
        UserMobile,
        UserEmail: UserEmail.toLowerCase(),
        UserName: UserName.toLowerCase(),
        UserPassword: hashUserPassword,
        RoleId,
        CompanyId,
        PayMethod,
        PayRates,
        IsWorking
    })

    // convert strin Location Id to Intiger
    let convertedLocationId = []
    for(let i = 0; i < LocationId.length; i++){
        convertedLocationId.push(parseInt(LocationId[i]))
    }

    // Find Location
    const locations = await Location.findAll({
        where:{
            [Op.and] :[
                {LocationId: {
                    [Op.in]: convertedLocationId
                }},
                {CompanyId: "1"}
            ]
            
        }
    })

    if(!locations){
        throw new ApiError(400, "Location you are trying to add could not found")
    }
    
    // add Location to UserLocation Junction table
    const addedLocation = await user.addLocations(locations)

    if(!addedLocation){
        throw new ApiError(500, "Can not add Location to user!")
    }
    
    // After create find User to make sure if user created or not
    const createdUser = await User.findAll({
        where: {
            UserId: user.UserId
        },
        attributes:{
            exclude: ["UserPassword", "RefreshToken", "createdAt", "updatedAt"]
        }
        
    })

    // If user not created
    if(!createdUser){
        throw new ApiError(500, "Something went while registering user")
    }

    // Sucessfully registerd user
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    ) 
})

const addRole = asyncHandler(async (req, res) => {
    const roleId = req.user.RoleId
    if(roleId !== 1){
        throw new ApiError(400, "Only Admin can Add roles!!!")
    }
    const { RoleName } =  req.body
    
    if(RoleName === "" || RoleName === undefined || RoleName === null){
        throw new ApiError(400, "Role Name is required!")
    }

    const existedRole = await Roles.findOne({where: {RoleName: RoleName}})

    if(existedRole){
        throw new ApiError(400, "Role already available!")
    }

    const role = await Roles.create({
        RoleName: RoleName.toLowerCase(),
    })

    const createRole = Roles.findByPk(role.RoleId)

    if(!createRole){
        throw new ApiError(500, "Some error happen while creating role!")
    }

    return res.status(201).json(
        new ApiResponse(200, createRole, "Role added successfully")
    )


})

const loginUser = asyncHandler(async (req,res)=>{
    const {UserName, UserEmail, UserPassword} = req.body

    if(!UserName && !UserEmail){
        throw new ApiError(400, "Username or Email Required")
    }

    let searchValue = ""
    if(UserName){
        searchValue = {
            UserName: UserName,
            UserStatus: "A"
        };
    }

    if(UserEmail){
        searchValue = {
            UserEmail: UserEmail,
            UserStatus: "A"
        };
    }

    const user = await User.findOne({
        where: searchValue
     })

    if(!user){
        throw new ApiError(404, "User does not exist!")
    }

    const isPasswordCorrect = await bcrypt.compare(UserPassword, user.UserPassword)

    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid User Credentials!")
    }

    const { refreshToken, accessToken} = await generateAccessAndRefreshTokens(user.UserId)

    
    const logedInUser = await User.findOne({
        where: {
            UserId: user.UserId
        },
        attributes:{
            exclude: ["UserPassword", "RefreshToken", "createdAt", "updatedAt"]
        },
        include:{
            model: Location,
            attributes: ["LocationId", "LocationName"],
            where:{
                LocationStatus: "A"
            },
            through:{
                attributes: ["UserLocationId"],
                where:{
                    [Op.and]: [
                        {LocationStatus: "A"},
                        {DefaultLocation: true}
                    ]
                }
            },
            required: false
        }
    })

    if(!logedInUser){
        throw new ApiError(400, "Unauthorized Request!!!")
    }

    let locationId, locationName
    if(logedInUser.Locations.length <= 0){
        locationId = null
        locationName = null
    }else{
    locationId = logedInUser.Locations[0].LocationId
    locationName = logedInUser.Locations[0].LocationName
    }
    
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .cookie("locationId", locationId, options)
        .cookie("locationName", locationName, options)
        .json(
            new ApiResponse(200, {
                user: logedInUser, accessToken, refreshToken
            },
                "User loged in successfully"
            )
        )

})

const logoutUser = asyncHandler(async(req, res) => {
    
    const user = await User.findByPk(req.user.UserId)

    user.set({
        RefreshToken: undefined
    })

    const logoutSucess = await user.save();

    if(!logoutSucess){
        throw new ApiError(500, "Some error has occured while loging out!")
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .clearCookie("locationId", options)
    .clearCookie("locationName", options)
    .json(new ApiResponse(200, {}, "User logged out sucessfully"))


})

const refreshAccessToken = asyncHandler(async (req, res) => {
   const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
   }

   try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)


   const user = await User.findOne({
        where: {
            UserId: decodedToken?.UserId
        },
        attributes:{
            exclude: ["UserPassword", "createdAt", "updatedAt"]
        },
        include:{
            model: Location,
            attributes: ["LocationId", "LocationName"],
            where:{
                LocationStatus: "A"
            },
            through:{
                attributes: ["UserLocationId"],
                where:{
                    [Op.and]: [
                        {LocationStatus: "A"},
                        {DefaultLocation: true}
                    ]
                }
            },
            required: false
        }
    })

    console.log(user)

    const locationId = user.Locations[0].LocationId
    const locationName = user.Locations[0].LocationName
 
   if(!user){
     throw new ApiError(401, "Invalid refresh Token")
   }

   if(incomingRefreshToken !== user?.RefreshToken){
     throw new ApiError(401, "Refresh token is expired or used!")
   }
 
   const {newRefreshToken, accessToken} = await generateAccessAndRefreshTokens(user.UserId)
 
   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", newRefreshToken, options)
   .cookie("locationId", locationId, options)
   .cookie("locationName", locationName, options)
   .json(
     new ApiResponse(200,
         {accessToken:accessToken, refreshToken: newRefreshToken},
         "Access token refreshed sucessfully!"
         )
   )
   } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token!")
   }

})

const changePassword = asyncHandler(async (req, res) =>{
    const {oldPassword, newPassword} = req.body

    const user = await User.findByPk(req.user?.UserId)

    if(!user){
        throw new ApiError(400, "You are not logedin!!!")
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.UserPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Your Password does not match")
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10)
    user.UserPassword = hashNewPassword
    await user.save({validate: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed sucessfully"))

})

const currentUser = asyncHandler(async (req, res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched sucessfully"))
   
})

const updateAccountDetails = asyncHandler(async (req, res)=>{
    const {userMobile, userEmail} = req.body

    if(!userMobile || !userEmail){
        throw new ApiError(400, "All field required!")
    }

    const user = await User.findByPk(req.user?.UserId)

    if(!user){
        throw new ApiError(400, "Can't find user to update details!")
    }

    const checkEmail = await User.findAll({
        where:{
            UserEmail: userEmail
        },
        attributes: ["UserEmail"]
    })

    if(checkEmail.length > 0){
        throw new ApiError(400, "Account with this email already exist!")
    }

    user.UserMobile = userMobile
    user.UserEmail = userEmail
    
    await user.save()

    const updatedUser = await User.findOne({
        where:{ 
            UserId: req.user?.UserId
        },
        attributes:{
            exclude: ["UserPassword", "RefreshToken", "createdAt", "updatedAt"]
        }
    })


    return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Account details updated!" ))

})

const updateAvatar = asyncHandler(async (req, res)=>{
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400, "Error while uploading avatar!")
    }

    const user = await User.findOne({
        where: {UserId: req.user?.UserId},
        attributes:{
            exclude: ["UserPassword", "RefreshToken", "createdAt", "updatedAt"]
        }
    })

    const avatarUrl = user?.Avatar
    const urlArray = avatarUrl?.split("/")
    const oldImage = urlArray[urlArray.length - 1].split(".")
    const oldImageName = oldImage[0]

    if(oldImageName){
        try {
            await deleteFromCloudinary(oldImageName)
        } catch (error) {
            throw new ApiError(500, "Got error while deleting old image")
        }
    }

    user.Avatar = avatar?.url
    await user.save()

    const updatedAvatar = await User.findOne({
        where:{
            UserId: req.user.UserId
        },
        attributes:{
            exclude: ["UserPassword", "RefreshToken", "createdAt", "updatedAt"]
        }
    })

    return res.status(200)
    .json(new ApiResponse(200, updatedAvatar, "Avatar image updated successfully"))

})

const userAllLocatons = asyncHandler(async (req, res)=>{
    const UserId = req.user.UserId
    const UserRole = req.user.RoleId

    let locations
    if(UserRole === 1){
        const userLocations = await Company.findAll({
            attributes: ["CompanyName", "CompanyLogo", "CompanyId"],
            include: {
                model: Location,
                attributes: ["LocationId", "LocationName"],
                where:{
                    LocationStatus: "A"
                }
            },
            where:{
                CompanyStatus: "A"
            }
        })

        if(!userLocations){
            throw new ApiError(400, "No Location Found For your!")
        }

        locations = userLocations
    }else{
        const userLocations = await User.findOne({
            where:{
                UserId: UserId
            },
            attributes: ["FullName"],
            include:{
                model: Location,
                attributes:["LocationId", "LocationName"],
                where: {
                    LocationStatus: "A"
                },
                through:{
                    attributes: ["UserLocationId"],
                    where:{
                        [Op.and]:[
                            {UserId: UserId},
                            {LocationStatus: "A"}
                        ]
                        
                    }
                }
            }
        })

        if(!userLocations){
            new ApiError(400, "No Location found for you!!")
        }

        locations = userLocations
        
    }

    return res.status(200).json( new ApiResponse(200, locations, "Sucessfully find locations"))


})
const loginLocation = asyncHandler(async(req,res)=>{
    // Receive store data from body
    // check if store Id maches with user
    // check store is active
    // check User location is active
    // set default location
    // set cookies for location

    const {LocationId} = req.body
    const UserId = req.user.UserId

    if(!LocationId){
        throw new ApiError(400, "Select Loction to set Location!")
    }

    const foundLocation = await User.findOne({
        where:{
            UserId: UserId
        },
        include:{
            model: Location,
            attribute: [ "LocationId", "LocationName" ],
            where:{
                LocationStatus: "A"
            },
            through:{
                attributes: ["UserLocationId"],
                where:{
                    [Op.and]: [
                        {LocationStatus: "A"},
                        {LocationId: LocationId},
                        {UserId: UserId}
                    ]
                }
            }
        }
    })

    if(!foundLocation){
        throw new ApiError(400, "Unauthorised request!!!")
    }

    const locationIdToUpdate = foundLocation?.Locations[0]?.LocationId
    const locationNameToUpdate = foundLocation?.Locations[0]?.LocationName

    res.status(200)
    .cookie("locationId", locationIdToUpdate, options)
    .cookie("locationName", locationNameToUpdate, options)
    .json(new ApiResponse(200, foundLocation, "Location set sucessfully"))

})


export {
    registerUser, 
    addRole, 
    loginUser, 
    logoutUser, 
    refreshAccessToken,
    changePassword,
    currentUser,
    updateAccountDetails,
    updateAvatar,
    loginLocation,
    userAllLocatons

}