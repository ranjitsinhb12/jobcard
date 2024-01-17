import { DataTypes, Model } from "sequelize";
import {sequelise} from "../../db/index.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../user.model.js";

const Customer = sequelise.define("Customer", {
    CustomerId: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true
    },
    CompanyName:{ 
     type: DataTypes.STRING,
     allowNull: false
     },
    ABN:{
     type: DataTypes.STRING,
    },
    Tel:{
     type: DataTypes.STRING,
    },
     ShippingAdd:{
     type: DataTypes.STRING,
     },
     BillingAdd:{
         type: DataTypes.STRING,
     }
    
}, 
{
 timestamps: true
});

const CustomerContact = sequelise.define("CustomerContact", {
    ContactId: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true
    },
    PersonName:{ 
     type: DataTypes.STRING,
     allowNull: false
     },
    ContactNo:{
     type: DataTypes.STRING,
    },
     ContactEmail:{
     type: DataTypes.STRING,
        validate:{
            isEmail: true
        }
     },
     ContactStatus:{
         type: DataTypes.BOOLEAN,
         defaultValue: true
     } 
}, 
{
 timestamps: true
});

User.hasMany(Customer, {foreignKey: "CreatedBy"})
Customer.belongsTo(User, {foreignKey: "CreatedBy"})

Customer.hasMany(CustomerContact, {foreignKey: "CompanyId"})
CustomerContact.belongsTo(Customer, {foreignKey: "CompanyId"})

export { Customer, CustomerContact }

