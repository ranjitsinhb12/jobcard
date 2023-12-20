import { Sequelize } from "sequelize";
import { ApiError } from "../utils/ApiError.js";

const sequelise = new Sequelize("jobcard", 'root', 'Jaymataji12!' , {
    "dialect": "mysql",
    "host": "localhost",
    "port": 3306
})


const connectDB = async () =>{
    try {
        await sequelise.authenticate()
       console.log("Connection successfull")
    } catch (error) {
        console.error("Unable to connect to the database: ", error)
    }
}

export {sequelise, connectDB}



