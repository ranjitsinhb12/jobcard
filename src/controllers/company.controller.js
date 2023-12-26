import {asyncHandler} from "../utils/asyncHandler.js"
import { Company } from "../models/company.model.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Location } from "../models/location.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const registerCompany = asyncHandler(async (req, res) => {
    const { CompanyName} = req.body

    // empty check for company Name
    if(CompanyName.trim() === ""){
        throw new ApiError(400, "Company name is required!")
    }

    // check if company exist
    const existedCompany = await Company.findOne({where: {CompanyName: CompanyName}})

    // ir company exist give error
    if(existedCompany){
        throw new ApiError(409, "Company already Exist!")
    }

    
    // check logo path 
    let logoLocalPath;
    if(req.files && Array.isArray(req.files.CompanyLogo) && req.files.CompanyLogo.length > 0){
        logoLocalPath = req.files.CompanyLogo[0].path
    }
 
    if(!logoLocalPath){
        throw new ApiError(500, "Can't find image or image is curpt!")
    }

    // uploade image in cloudinary
    const uploadedLogo = await uploadOnCloudinary(logoLocalPath)

    const company = await Company.create({
        CompanyName,
        CompanyLogo: uploadedLogo?.url || ""

    })

    const createCompany = await Company.findByPk(company.CompanyId)

    if(!createCompany){
        throw new ApiError(500, "Something went wrong while registring Company")
    }

    return res.status(201).json(
        new ApiResponse(201, createCompany, "Company registered Successfully!")
    )

})

const registerLocaton = asyncHandler(async(req, res)=>{

    const {  LocationName, LocationAddress, LocationContact, LocationEmail, LocationABN, CompanyId} = req.body

    if(CompanyId === "" || CompanyId <= 0 || CompanyId === undefined || CompanyId === null){
        throw new ApiError(400, "Please select company to add Locations!")
    }

    const checkEmpty = [LocationName, LocationABN, LocationAddress].some((field) => field?.trim() === "");

    if( checkEmpty){
        throw new ApiError(400, "Name, ABN and Address is required field!")
    }

    const existedLocation = await Location.findOne({where: {locationName: LocationName}})

    if(existedLocation){
        throw new ApiError(401, "Location already exist!")
    }

    const location = await Location.create({
        LocationName: LocationName,
        LocationAddress: LocationAddress,
        LocationABN: LocationABN,
        LocationContact: LocationContact,
        LocationEmail: LocationEmail,
        CompanyId: 1

    }).then(()=>{
        return res.status(201).json(
            new ApiResponse(201, location, "Locations Added sucessfully")
        )
    }).catch((err)=>{
        throw new ApiError(500, "Some error occured while creating Location!", err)
    })
    

})
export{
    registerCompany,
    registerLocaton
}
