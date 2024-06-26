import { DataTypes, Model } from "sequelize";
import {sequelise} from "../../db/index.js"
import { User } from "../user.model.js";
import { Company } from "../company.model.js";


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

User.hasMany(Customer, {htmlForeignKey: "CreatedBy"})
Customer.belongsTo(User, {htmlForeignKey: "CreatedBy"})

Customer.hasMany(CustomerContact, {htmlForeignKey: "CompanyId"})
CustomerContact.belongsTo(Customer, {htmlForeignKey: "CompanyId"})

Company.hasMany(Customer, {htmlForeignKey: "CompanyId"})
Customer.belongsTo(Company, {htmlForeignKey: "CompanyId"})

export { Customer, CustomerContact }

