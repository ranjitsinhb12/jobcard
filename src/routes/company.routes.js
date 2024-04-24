import { Router } from "express";
import { 
    registerCompany, 
    registerLocaton, 
    allCompany, 
    locationByCompany,
    updateLocation,
    currentLocation,
    updateCompany

} from "../controllers/company.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/role.middleware.js";

const router = Router()

router.route("/addcompany").post(verifyJWT, verifyAdmin,
    upload.fields([
        {
            name: "CompanyLogo",
            maxCount: 1
        }
    ]),
    registerCompany
    )

router.route("/all-companies").get(verifyJWT, verifyAdmin, allCompany)

router.route("/addlocation").post(verifyJWT, verifyAdmin, registerLocaton)

router.route("/edit-location").post(verifyJWT, verifyAdmin, updateLocation)

router.route("/get-location-by-company").post(verifyJWT, locationByCompany)

router.route("/current-location").get(verifyJWT, currentLocation)

router.route("/edit-company").post(verifyJWT, verifyAdmin, updateCompany)



export default router