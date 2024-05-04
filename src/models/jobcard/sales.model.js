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

const Outsourcing = sequelise.define("Outsourcing", {
    OutsourcingId: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true
    },
    OutsourcingType:{ 
     type: DataTypes.STRING,
     allowNull: false
     },
    Status:{
     type: DataTypes.BOOLEAN,
     defaultValue: true
    }
}, 
{
 timestamps: false
});

const OutsourcingCompany = sequelise.define("OutsourcingCompany", {
    OCompanyId: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true
    },
    OCompanyName:{ 
     type: DataTypes.STRING,
     allowNull: false
     },
     OContactNo:{ 
     type: DataTypes.STRING,
    },
    OEmail:{ 
     type: DataTypes.STRING,
     allowNull: false,
     validate:{
        isEmail: true
     }
    },
    Status:{
     type: DataTypes.BOOLEAN,
     defaultValue: true
    }
}, 
{
 timestamps: false
});

const JobOutsourcing = sequelise.define("JobOutsourcing", {
    JOId: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true
    },
    JOStatus:{
     type: DataTypes.BOOLEAN,
     defaultValue: true
    }
}, 
{
 timestamps: false
});

/// User relation to Quote
User.hasMany(Quote, {htmlForeignKey: "QuotedBy"})
Quote.belongsTo(User, {htmlForeignKey: "QuotedBy"})

/// Contact Person relation to Quote
CustomerContact.hasMany(Quote, {htmlForeignKey: "ContactId"})
Quote.belongsTo(CustomerContact, {htmlForeignKey: "ContactId"})

/// Customer relation to Quote
Customer.hasMany(Quote, {htmlForeignKey: "CustomerId"})
Quote.belongsTo(Customer, {htmlForeignKey: "CustomerId"})

/// Location relation to Quote
Location.hasMany(Quote, {htmlForeignKey: "LocationId"})
Quote.belongsTo(Location, {htmlForeignKey: "LocationId"})

/// Quote relation to Jobdetaoils
Quote.hasMany(JobDetail, { htmlForeignKey: "QuoteId"} )
JobDetail.belongsTo(Quote, { htmlForeignKey: "QuoteId"} )

/// User relation to Job details
User.hasMany(JobDetail, {htmlForeignKey: "ProgrammedBy"})
JobDetail.belongsTo(User, {htmlForeignKey: "ProgrammedBy"})

/// Contact Person relation to Job details
CustomerContact.hasMany(JobDetail, {htmlForeignKey: "JobApprovedBy"})
JobDetail.belongsTo(CustomerContact, {htmlForeignKey: "JobApprovedBy"})

/// User relation to JobDetail as QC by
User.hasMany(JobDetail, {htmlForeignKey: "QCBy"})
JobDetail.belongsTo(User, {htmlForeignKey: "QCBy"})

/// User relation to JobDetail as DispatchBy
User.hasMany(JobDetail, {htmlForeignKey: "DispatchBy"})
JobDetail.belongsTo(User, {htmlForeignKey: "DispatchBy"})

/// Location relation to JobDetail
Location.hasMany(JobDetail, {htmlForeignKey: "LocationId"})
JobDetail.belongsTo(Location, {htmlForeignKey: "LocationId"})

/// JobDetail relation to job material
JobDetail.hasMany(JobMaterial, {htmlForeignKey: "JobId"})
JobMaterial.belongsTo(JobDetail, {htmlForeignKey: "JobId"})

/// JobDetail relation job Tube material
JobDetail.hasMany(JobTubeMaterial, {htmlForeignKey: "JobId"})
JobTubeMaterial.belongsTo(JobDetail, {htmlForeignKey: "JobId"})

/// JobDetail relation to freeissue Material
JobDetail.hasMany(FreeIssueMaterial, {htmlForeignKey: "JobId"})
FreeIssueMaterial.belongsTo(JobDetail, {htmlForeignKey: "JobId"})

/// JobDetail relation to JobOutsourcing
JobDetail.hasMany(JobOutsourcing, {htmlForeignKey: "JobId"})
JobOutsourcing.belongsTo(JobDetail, {htmlForeignKey: "JobId"})

/// OutsourcingCompany relation to JobOutsourcing
OutsourcingCompany.hasMany(JobOutsourcing, {htmlForeignKey: "OCompanyId"})
JobOutsourcing.belongsTo(OutsourcingCompany, {htmlForeignKey: "OCompanyId"})

/// Outsourcing relation to JobOutsourcing
Outsourcing.hasMany(JobOutsourcing, {htmlForeignKey: "OutsourcingId"})
JobOutsourcing.belongsTo(Outsourcing, {htmlForeignKey: "OutsourcingId"})

export { 
    Quote, 
    JobDetail, 
    JobMaterial, 
    JobTubeMaterial, 
    FreeIssueMaterial, 
    Outsourcing, 
    OutsourcingCompany, 
    JobOutsourcing 
}