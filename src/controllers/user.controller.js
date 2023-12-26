import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User, UserLocation, Roles } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { Op } from "sequelize";
import bcrypt from "bcrypt"


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
            UserName: UserName
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

    const avatar = await uploadOnCloudinary(avatarLocalPath)

     if(!avatar){
         throw new ApiError(400, "Avatar image is required!")
     }

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

    console.log(createdUser)

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

export {registerUser, addRole}