import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { LIMIT } from "./constants.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: LIMIT}))

app.use(express.urlencoded({extended: true, limit: "12kb"}))

app.use(express.static("public"))

app.use(cookieParser())

import companyRouter from "./routes/company.routes.js"
import userRouter from "./routes/user.routes.js"
import jobCardRouter from "./routes/jobcard.routes.js"

app.use("/api/v1/company", companyRouter)

app.use("/api/v1/user", userRouter)

app.use("/api/v1/jobcard", jobCardRouter)


export{ app }

