import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { Op } from "sequelize";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
       const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
       //const location = req.cookies?.locationId || req.header("Authorization")?.replace("Bearer", "")

       if(!token || token == "undefined" || token == null){
        throw new ApiError(401, "Unauthorized request!!!!")
       }

       console.log(`Token: ${typeof token}`)

       const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

       if(!decodedToken){
        throw new ApiError(401, "Unauthorized request!!!!")
       }


    const user = await User.findOne({ 
        where: {
            UserId: decodedToken?.UserId
        },
        attributes:{
            exclude: ["UserPassword", "RefreshToken", "createdAt", "updatedAt"]
        }
        
    })

    if(!user){
        throw new ApiError(403, "Invalid Access Token!!!!!!!!")
    }

    req.user = user;
    next()
    
    } catch (error) {
       throw new ApiError(403, error?.message || "Invalid Access Token")
     }
})

export { verifyJWT}