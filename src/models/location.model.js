import { DataTypes, Model } from "sequelize";
import {sequelise} from "../db/index.js"
import { ApiError } from "../utils/ApiError.js";
import { Company} from "./company.model.js"



const Location = sequelise.define("Location", {
       LocationId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
       },
       LocationName:{ 
        type: DataTypes.STRING,
        allowNull: false
        },
       LocationAddress: {
           type: DataTypes.STRING,
            allowNull: false
       },
       LocationABN:{
            type: DataTypes.STRING,
            allowNull: false
       },
       LocationContact:{
            type: DataTypes.STRING,
            allowNull: true
       },
       LocationEmail:{
            type: DataTypes.STRING,
            validate:{
                isEmail: true
            }
       },
       LocationStatus:{
            type: DataTypes.STRING,
            defaultValue: "A"
       }
    
}, {timestamps: true});


Company.hasMany(Location, {foreignKey: "CompanyId"})

// Location.sync({alter: true}).then((data)=>{
//     console.log("Tabel and model synced successfully")
// })
// .catch((err)=>{
//     throw new ApiError(500, "ERROR: ", err)
// })

 export {Location}

