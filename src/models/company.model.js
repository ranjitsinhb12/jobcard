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
Location.belongsTo(Company, {foreignKey: "CompanyId"})

export { Company, Location }