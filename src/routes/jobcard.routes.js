import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { 
    registerCustomer, 
    updateCustomer,
    addCustomerContact,
    updateCustomerContact,

} from "../controllers/jobcard/customer.controller.js";


const router = Router()

router.route("/registercustomer").post(verifyJWT, registerCustomer)
router.route("/updatecustomer").post(verifyJWT, updateCustomer )
router.route("/addcontact").post(verifyJWT, addCustomerContact )
router.route("/updatecontact").post(verifyJWT, updateCustomerContact)


export default router