import { DataTypes, Model } from "sequelize";
import {sequelise} from "../../db/index.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../user.model.js";
import { CustomerContact, Customer } from "./customer.model.js";
import { Location } from "../company.model.js";

const Quote = sequelise.define("Quote", {
    QuoteId: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true
    },
    QuoteNo:{ 
     type: DataTypes.STRING,
     allowNull: false
     },
    QuotePrice:{
     type: DataTypes.DECIMAL,
     allowNull: false
    },
    LabourCost:{
     type: DataTypes.DECIMAL,
     allowNull: false
    },
    QuoteComment:{
     type: DataTypes.STRING,
    },
     QuoteStatus:{
     type: DataTypes.STRING,
     }
}, 
{
 timestamps: true
});

const JobDetail = sequelise.define("JobDetail", {
    JobId: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true
    },
    PurchaseOrder:{ 
     type: DataTypes.STRING,
     allowNull: false
     },
    JobNumber:{
     type: DataTypes.STRING,
     allowNull: false
    },
    OrderMethod:{
     type: DataTypes.STRING,
     allowNull: false
    },
    ProgrammerComment:{
     type: DataTypes.STRING,
    },
    DueDate:{
     type: DataTypes.INTEGER,
    },
    DrawingTime:{
        type: DataTypes.INTEGER,
    },
    JobStatus:{
        type: DataTypes.STRING,
        defaultValue: "Created"  
    },
    CostBasis:{
        type: DataTypes.STRING,
    },
    QCComment:{
        type: DataTypes.STRING,
    },
    FinalPriceExGST:{
        type: DataTypes.DECIMAL
    },
    FinalPriceIncGST:{
        type: DataTypes.DECIMAL
    },
    DispatchComment:{
        type: DataTypes.STRING,
    },
    DispatchDate:{
        type: DataTypes.DATE
    }

}, 
{
 timestamps: true
});


const JobMaterial = sequelise.define("JobMaterial", {
    JobMaterialId: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true
    },
    MaterialType:{ 
     type: DataTypes.STRING,
     allowNull: false
     },
    ThickNess:{
     type: DataTypes.STRING,
     allowNull: false
    }
}, 
{
 timestamps: false
});

const JobTubeMaterial = sequelise.define("JobTubeMaterial", {
    JobTubeMaterialId: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true
    },
    TubeMaterial:{ 
     type: DataTypes.STRING,
     allowNull: false
     },
    TubeSize:{
     type: DataTypes.STRING,
     allowNull: false
    },
    TubeQty:{
        type: DataTypes.STRING,
        allowNull: false
       }
}, 
{
 timestamps: false
});

const FreeIssueMaterial = sequelise.define("FreeIssueMaterial", {
    FIId: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true
    },
    FIDate:{ 
     type: DataTypes.STRING,
     allowNull: false
     },
    FIOrderNo:{
     type: DataTypes.STRING,
     allowNull: false
    },
    FISupplier:{
     type: DataTypes.STRING,
     allowNull: false
    },
    FIDateToArrive:{
     type: DataTypes.STRING,
     allowNull: false
    }
}, 
{
 timestamps: false
});






User.hasMany(Quote, {foreignKey: "QuotedBy"})
Quote.belongsTo(User, {foreignKey: "QuotedBy"})

CustomerContact.hasMany(Quote, {foreignKey: "ContactId"})
Quote.belongsTo(CustomerContact, {foreignKey: "ContactId"})

Customer.hasMany(Quote, {foreignKey: "CustomerId"})
Quote.belongsTo(Customer, {foreignKey: "CustomerId"})

Quote.hasMany(JobDetail, { foreignKey: "QuoteId"} )
JobDetail.belongsTo(Quote, { foreignKey: "QuoteId"} )

User.hasMany(JobDetail, {foreignKey: "ProgrammedBy"})
JobDetail.belongsTo(User, {foreignKey: "ProgrammedBy"})

CustomerContact.hasMany(JobDetail, {foreignKey: "JobApprovedBy"})
JobDetail.belongsTo(CustomerContact, {foreignKey: "JobApprovedBy"})

User.hasMany(JobDetail, {foreignKey: "QCBy"})
JobDetail.belongsTo(User, {foreignKey: "QCBy"})

User.hasMany(JobDetail, {foreignKey: "DispatchBy"})
JobDetail.belongsTo(User, {foreignKey: "DispatchBy"})

JobDetail.hasMany(JobMaterial, {foreignKey: "JobId"})
JobMaterial.belongsTo(JobDetail, {foreignKey: "JobId"})

JobDetail.hasMany(JobTubeMaterial, {foreignKey: "JobId"})
JobTubeMaterial.belongsTo(JobDetail, {foreignKey: "JobId"})

JobDetail.hasMany(FreeIssueMaterial, {foreignKey: "JobId"})
FreeIssueMaterial.belongsTo(JobDetail, {foreignKey: "JobId"})





export { Quote, JobDetail, JobMaterial, JobTubeMaterial, FreeIssueMaterial }