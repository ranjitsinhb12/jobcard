import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Location, Company } from "../models/company.model.js"
import jwt from "jsonwebtoken"
import { Op } from "sequelize";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
       const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
       const location = req.cookies?.locationId || req.header("Authorization")?.replace("Bearer", "")

       if(!token){
        throw new ApiError(401, "Unauthorized request!!!!")
       }

       const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findOne({ 
        where: {
            UserId: decodedToken?.UserId
        },
        attributes:{
            exclude: ["UserPassword", "RefreshToken", "createdAt", "updatedAt"]
        },
        include:{
            model: Location,
            attributes:["LocationId", "LocationName"],
            where:{
                LocationStatus: "A"
            },
            through:{
                attributes: ["UserLocationId", "DefaultLocation"],
                where:{
                    [Op.and]: [
                        {LocationStatus: "A"},
                        {UserId: decodedToken?.UserId},
                        {LocationId: location}
                    ]
                    
                }
            }
        }
    })
    if(!user){
        throw new ApiError(401, "Invalid Access Token!")
    }

    req.user = user;
    next()
    
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})

export { verifyJWT}