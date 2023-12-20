import { Router } from "express";
import { registerCompany } from "../controllers/company.controller.js";

const router = Router()

router.route("/addcompany").post(registerCompany)

export default router