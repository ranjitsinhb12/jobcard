import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Customer, CustomerContact } from "../../models/jobcard/customer.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Op } from "sequelize";



const registerCustomer = asyncHandler(async (req, res) =>{
    const {CompanyName, ABN, Tel, ShippingAddress, BillingAddress, PersonName, ContactNo, ContactEmail} = req.body
    const {UserId, CompanyId} = req.user

    if(UserId == "" || CompanyId == "" || UserId <= 0 || CompanyId <= 0){
        throw new ApiError(400, "Please Login!!!")
    }

    if(
        [CompanyName, ABN, Tel, ShippingAddress, BillingAddress, PersonName, ContactNo, ContactEmail].some(field => field.trim() == "")
    ){
        throw new ApiError(400, "All field are required!")
    }

    const foundCompany = await Customer.findOne({
        where:{
            [Op.or]: [{CompanyName: CompanyName},{ABN: ABN}]
        }
    })

    if(foundCompany){
        throw new ApiError(400, "Company already exist!!!")
    }

    const customer = await Customer.create({
        CompanyName: CompanyName,
        ABN: ABN,
        Tel: Tel,
        ShippingAdd: ShippingAddress,
        BillingAdd: BillingAddress,
        CreatedBy: UserId,
        CompanyId: CompanyId
    })

    if(!customer){
        throw new ApiError(500, "Some error occured while creating customer!")
    }

    return res.status(201).json(
        new ApiResponse(200, "Customer added Successfully")
    )

})

const updateCustomer = asyncHandler(async (req, res)=>{
    const {CompanyName, ABN, Tel, ShippingAddress, BillingAddress} = req.body
    const {UserId, CompanyId} = req.user

    console.log(UserId)
    console.log(CompanyId)
    if(!UserId || !CompanyId){
        throw new ApiError(400, "Please Login!!!")
    }

    if(
        [CompanyName, ABN, Tel, ShippingAddress, BillingAddress].some(field => field.trim() == "")
    ){
        throw new ApiError(400, "All field are required!")
    }

    const updateCustomer = await Customer.findOne({
        where: {
            ABN: ABN
        }
    })

    if(!updateCustomer){
        throw new ApiError(400, "Company not found to update!")
    }

    updateCustomer.CompanyName = CompanyName
    updateCustomer.ABN = ABN
    updateCustomer.Tel = Tel
    updateCustomer.ShippingAdd = ShippingAddress
    updateCustomer.BillingAdd = BillingAddress

    await updateCustomer.save()

    return res
    .status(200)
    .json( new ApiResponse(200, updateCustomer, "Customer updated sucessfully!!!"))


})

const addCustomerContact = asyncHandler(async (req, res)=>{
    const {PersonName, ContactNo, ContactEmail, CustomerId} = req.body

    if(CustomerId.length <=0){
        throw new ApiError(400, "Please customer to add contact")
    }

    if([PersonName, ContactNo, ContactEmail].some(field=>field.trim() == "")){
        throw new ApiError(400, "All filed required!!!")
    }

    const foundCompany = await Customer.findOne({
        where:{
            CustomerId: CustomerId
        }
    })

    if(!foundCompany){
        throw new ApiError(400, "Customer not fund!")
    }

    const customerId = foundCompany.CustomerId

    const foundContactPerson = await CustomerContact.findOne({
        where:{
            [Op.or]: [{ContactNo: ContactNo}, {ContactEmail: ContactEmail}]
        }
    })

    if(foundContactPerson){
        throw new ApiError(400, "Contact Person Already exist!!!")
    }

    const addContact = await CustomerContact.bulkCreate([
        {
            PersonName: PersonName, 
            ContactNo: ContactNo,
            ContactEmail: ContactEmail,
            CompanyId: customerId
        }
    ])

    if(!addContact){
        throw new ApiError(500, "Some error occured while creating Contact details")
    }

    return res.status(201).json(
        new ApiResponse(200, addContact, "Contact Person added Successfully")
    ) 
})

const updateCustomerContact = asyncHandler(async (req, res) => {
    const {PersonName, ContactNo, ContactEmail, CustomerId, ContactId} = req.body

    if(!CustomerId || !ContactId){
        throw new ApiError(400, "Customer Id and Contact Id is required!")
    }

    if([PersonName, ContactNo, ContactEmail].some(field=>field.trim() == "")){
        throw new ApiError(400, "All filed required!!!")
    }

    const updateContact = await CustomerContact.findByPk(ContactId)

    if(!updateContact){
        throw new ApiError(400, "Can not find contact to update!!!")
    }

    updateContact.PersonName = PersonName
    updateContact.ContactNo = ContactNo
    updateContact.ContactEmail = ContactEmail
    updateContact.CompanyId = CustomerId

   await updateContact.save()

   return res
   .status(201)
   .json( new ApiResponse(200, "Sucessfuly updated contact!!!"))


})



export{
    registerCustomer,
    updateCustomer,
    addCustomerContact,
    updateCustomerContact
}