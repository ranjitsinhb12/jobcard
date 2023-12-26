import { Router } from "express";
import { registerCompany, registerLocaton } from "../controllers/company.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/addcompany").post(
    upload.fields([
        {
            name: "CompanyLogo",
            maxCount: 1
        }
    ]),
    registerCompany
    )

router.route("/addlocation").post(registerLocaton)

export default router