import express from "express"
import cors from "cors"
import { LIMIT } from "./constants.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: LIMIT}))

app.use(express.urlencoded({extended: true, limit: "12kb"}))

app.use(express.static("public"))

import userRouter from "./routes/company.routes.js"

app.use("/api/v1/company", userRouter)


export{ app }

