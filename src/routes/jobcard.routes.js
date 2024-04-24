import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { 
    registerCustomer, 
    updateCustomer,
    addCustomerContact,
    updateCustomerContact,

} from "../controllers/jobcard/customer.controller.js";
import { verifyQuatation } from "../middlewares/role.middleware.js";


const router = Router()

router.route("/registercustomer").post(verifyJWT, verifyQuatation, registerCustomer)
router.route("/updatecustomer").post(verifyJWT, verifyQuatation, updateCustomer )
router.route("/addcontact").post(verifyJWT, verifyQuatation, addCustomerContact )
router.route("/updatecontact").post(verifyJWT, verifyQuatation, updateCustomerContact)


export default router