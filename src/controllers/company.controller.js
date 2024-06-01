import {asyncHandler} from "../utils/asyncHandler.js"
import { Company, Location } from "../models/company.model.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { json } from "sequelize"

const registerCompany = asyncHandler(async (req, res) => {
    const roleId = req.user.RoleId
    if(roleId !== 1){
        throw new ApiError(400, "Unauthorised Request, Only admin can Add company!")
    }
    const { CompanyName} = req.body
    console.log(admin)
    // empty check htmlFor company Name
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

const allCompany = asyncHandler(async(req, res)=>{
    const roleId = req.user.RoleId
    if(roleId !== 1){
        throw new ApiError(400, "Unauthorised Request, Please contact Admin")
    }

   const companies =  await Company.findAll({
        attributes:{
            exclude: ["createdAt", "updatedAt"]
        }
   })

   res.status(200)
   .json( new ApiResponse(200, companies, "All company found sucessfully!"))

})

const updateCompany = asyncHandler(async(req,res)=>{

    const roleId = req.user.RoleId

    if(roleId !== 1 ){
        throw new ApiError(400, "You do not have Access to edit Company")
    }
    
    const {CompanyId, CompanyName, CompanyStatus} = req.body

    if([CompanyId, CompanyName, CompanyStatus].some(field=> field.trim() === "")){
        throw new ApiError(400, "All field required")
    }

    const company = await Company.findByPk(CompanyId)

    if(!company){
        throw new ApiError(400, "Please select company to edit!")
    }

    company.CompanyName = CompanyName
    company.CompanyStatus = CompanyStatus

    const updatedCompany = await company.save()

    if(!updatedCompany){
        throw new ApiError(500, "Some error has occured, contact admin!")
    }

    const editedCompany = await Company.findByPk(CompanyId)

    if(editedCompany.CompanyStatus == "D"){
        const locationsToUpdate = await Location.update({LocationStatus: "D"},{
            where:{
                CompanyId: editedCompany?.CompanyId
            }
        })

        if(!locationsToUpdate){
            throw new ApiError(400, "Can not find any location, Contact Admin!")
        }
        
    }

    res.status(200)
    .json( new ApiResponse(200, {editedCompany}, "Company Updated Sucessfully"))

})

const registerLocaton = asyncHandler(async(req, res)=>{
    const roleId = req.user.RoleId
    if(roleId !== 1){
        throw new ApiError(400, "Unauthorised Request, Only admin can register location!")
    }
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

    })

    if(!location){
        throw new ApiError(400, "Can not add Location, Pleaes try later!")
    }
    
    return res.status(201).json(
        new ApiResponse(201, location, "Locations Added sucessfully")
    )

    

})

const locationByCompany = asyncHandler(async(req, res)=>{
    const CompanyId = req?.user?.CompanyId
    console.log(CompanyId)
    const allLocationByCompany = await Location.findAll({
        where:{
            CompanyId: CompanyId
        }
    })

    return res.status(200)
    .json( new ApiResponse(200, allLocationByCompany, "All location found For company"))
})

const currentLocation = asyncHandler(async (req, res)=>{
    const LocationId = req.user?.Locations[0]?.LocationId

   const location = await Location.findOne({
        where:{
            LocationId: LocationId
        },
        include:{
            model: Company
        }
    })

    res.status(200)
    .json(new ApiResponse(200, location, "Current Location sucessfully found!"))
})

const updateLocation = asyncHandler(async(req,res)=>{
    const roleId = req.user.RoleId

    if(roleId !== 1 && roleId !== 2 && roleId !== 3){
        throw new ApiError(400, "You do not have Access to edit Location")
    }

    const {LocationName, LocationAddress, LocationABN, LocationContact, LocationEmail, LocationStatus} = req.body
    const LocationId = req.user?.Locations[0]?.LocationId

    if(
        [LocationName, LocationAddress, LocationABN, LocationContact, LocationEmail].some(field=> field.trim() === "")
    ){
        throw new ApiError(400, "All fields are required!")
    }

    const location = await Location.findOne({
        where: {
            LocationId: LocationId
         }
    })

    if(!location){
        throw new ApiError(400, "Can not find location!")
    }
    location.LocationName = LocationName
    location.LocationAddress = LocationAddress
    location.LocationABN = LocationABN
    location.LocationContact = LocationContact
    location.LocationEmail = LocationEmail
    location.LocationStatus = LocationStatus

    await location.save()

    res.status(200)
    .json(new ApiResponse(200, {}, "Location Updated sucessfully"))

})


export{
    registerCompany,
    registerLocaton,
    allCompany,
    updateLocation,
    locationByCompany,
    currentLocation,
    updateCompany
}
