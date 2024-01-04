import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User, UserLocation, Roles } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
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
    const { FullName, UserMobile, UserEmail, UserName, UserPassword, LocationId, RoleId} = req.body

    if(
        [FullName, UserMobile, UserEmail, UserName, UserPassword].some((field)=> field.trim() === ""
        )
    ){
        throw new ApiError(400, "All fields are required!")
    }

    const existedUser = await User.findOne({
        where:{
           [Op.or]:  [{UserName: UserName}, {UserEmail: UserEmail}]
        }    
    })

    if(existedUser){
        throw new ApiError(400, "User Already Exist!")
    }

    let avatarLocalPath;
    if(req.files && Array.isArray(req.files.Avatar) && req.files.Avatar.length > 0){
        avatarLocalPath = req.files.Avatar[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required!")
    }
     console.log(avatarLocalPath)
    const avatar = await uploadOnCloudinary(avatarLocalPath)

     if(!avatar){
         throw new ApiError(400, "Avatar image is required!")
     }

     console.log(`Avatora log uploaded: ${avatar}`)
    
    const hashUserPassword = await bcrypt.hash(UserPassword, 10)

    const user = await User.create({
        FullName,
        Avatar: avatar?.url || "",
        UserMobile,
        UserEmail: UserEmail.toLowerCase(),
        UserName: UserName.toLowerCase(),
        UserPassword: hashUserPassword,
        RoleId

    })

    const userLocation = await UserLocation.create({
        UserId: user.UserId,
        LocationId: LocationId
    })

    const createdUser = await User.findAll({
        where: {
            UserId: user.UserId
        },
        attributes:{
            exclude: ["UserPassword", "RefreshToken", "createdAt", "updatedAt"]
        }
        
    })

    if(!createdUser){
        throw new ApiError(500, "Something went while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    ) 
})

const addRole = asyncHandler(async (req, res) => {
    
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
        searchValue = {UserName: UserName};
    }

    if(UserEmail){
        searchValue = {UserEmail: UserEmail};
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

    const logedInUser = await User.findAll({
        where: {
            UserId: user.UserId
        },
        attributes:{
            exclude: ["UserPassword", "RefreshToken", "createdAt", "updatedAt"]
        }
    })

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
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
    .json(new ApiResponse(200, {}, "User logged out sucessfully"))


})

const refreshAccessToken = asyncHandler(async (req, res) => {
   const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
   }

   try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
 
   const user =  await User.findByPk(decodedToken?.UserId)
 
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



export {registerUser, addRole, loginUser, logoutUser, refreshAccessToken}