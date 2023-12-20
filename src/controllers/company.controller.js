import {asyncHandler} from "../utils/asyncHandler.js"
import { Company } from "../models/company.model.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerCompany = asyncHandler(async (req, res) => {
    const { companyName, companyLogo} = req.body

    if(companyName.trim() === ""){
        throw new ApiError(400, "Company name is required!")
    }

    const existedCompany = await Company.findOne({companyName: companyName})

    if(existedCompany){
        throw new ApiError(409, "Company already Exist!")
    }

    const company = await Company.create({
        companyName: companyName,
        companyLogo: companyLogo

    })

    const createCompany = await Company.findByPk(company.id)

    if(!createCompany){
        throw new ApiError(500, "Something went wrong while registring Company")
    }

    return res.status(201).json(
        new ApiResponse(201, createCompany, "Company registered Successfully!")
    )

})

export{
    registerCompany
}
