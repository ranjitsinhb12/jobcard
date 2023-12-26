import { DataTypes, Model } from "sequelize";
import {sequelise} from "../db/index.js"

const Company = sequelise.define("Company", {
       CompanyId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
       },
       CompanyName:{ 
        type: DataTypes.STRING,
        allowNull: false
        },
       CompanyStatus: {
           type: DataTypes.STRING,
            defaultValue: "A"
       },
       CompanyLogo:{
            type: DataTypes.STRING,
       }
    
}, {timestamps: true});

export { Company }