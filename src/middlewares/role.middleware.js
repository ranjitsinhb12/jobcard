import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const verifyAdmin = asyncHandler(async(req, res, next)=>{
    const roleId = req.user.RoleId;
    if(roleId <= 0){
        throw new ApiError(401, "Please Check Your Role!!!!!!!!")
    }
    if(roleId === 1){
        console.log(roleId)
    }else{
        throw new ApiError(401, "You are not admin!!!!!!!!")
    }
    next()
})

const verifyOwner = asyncHandler(async(req,res,next)=>{
    const roleId = req.user.RoleId;
    if(roleId <= 0){
        throw new ApiError(401, "Please Check Your Role!!!!!!!!")
    }
    if(roleId <=2){
        console.log(roleId)
    }else{
        throw new ApiError(401, "You have to be either admin or Owner!!!!!!!!")
    }
    next()
})

const verifyManager = asyncHandler(async(req,res,next)=>{
    const roleId = req.user.RoleId;
    if(roleId <= 0){
        throw new ApiError(401, "Please Check Your Role!!!!!!!!")
    }
    if(roleId <=3){
        console.log(roleId)
    }else{
        throw new ApiError(401, "You are not Manager!!!!!!!!")
    }
    next()
})

const verifyQuatation = asyncHandler(async(req,res,next)=>{
    const roleId = req.user.RoleId;
    if(roleId <= 0){
        throw new ApiError(401, "Please Check Your Role!!!!!!!!")
    }
    if(roleId <=4){
        console.log(roleId)
    }else{
        throw new ApiError(401, "You are not Quatation Person!!!!!!!!")
    }
    next()
})

const verifyMachineOperator = asyncHandler(async(req,res,next)=>{
    const roleId = req.user.RoleId;
    if(roleId <= 0){
        throw new ApiError(401, "Please Check Your Role!!!!!!!!")
    }
    if(roleId <= 5){
        console.log(roleId)
    }else{
        throw new ApiError(401, "You are not Quatation Person!!!!!!!!")
    }
    next()
})

export{
    verifyAdmin,
    verifyOwner,
    verifyManager,
    verifyQuatation,
    verifyMachineOperator

}