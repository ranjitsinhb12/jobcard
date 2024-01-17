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
User.hasMany(Quote, {foreignKey: "QuotedBy"})
Quote.belongsTo(User, {foreignKey: "QuotedBy"})

/// Contact Person relation to Quote
CustomerContact.hasMany(Quote, {foreignKey: "ContactId"})
Quote.belongsTo(CustomerContact, {foreignKey: "ContactId"})

/// Customer relation to Quote
Customer.hasMany(Quote, {foreignKey: "CustomerId"})
Quote.belongsTo(Customer, {foreignKey: "CustomerId"})

/// Location relation to Quote
Location.hasMany(Quote, {foreignKey: "LocationId"})
Quote.belongsTo(Location, {foreignKey: "LocationId"})

/// Quote relation to Jobdetaoils
Quote.hasMany(JobDetail, { foreignKey: "QuoteId"} )
JobDetail.belongsTo(Quote, { foreignKey: "QuoteId"} )

/// User relation to Job details
User.hasMany(JobDetail, {foreignKey: "ProgrammedBy"})
JobDetail.belongsTo(User, {foreignKey: "ProgrammedBy"})

/// Contact Person relation to Job details
CustomerContact.hasMany(JobDetail, {foreignKey: "JobApprovedBy"})
JobDetail.belongsTo(CustomerContact, {foreignKey: "JobApprovedBy"})

/// User relation to JobDetail as QC by
User.hasMany(JobDetail, {foreignKey: "QCBy"})
JobDetail.belongsTo(User, {foreignKey: "QCBy"})

/// User relation to JobDetail as DispatchBy
User.hasMany(JobDetail, {foreignKey: "DispatchBy"})
JobDetail.belongsTo(User, {foreignKey: "DispatchBy"})

/// Location relation to JobDetail
Location.hasMany(JobDetail, {foreignKey: "LocationId"})
JobDetail.belongsTo(Location, {foreignKey: "LocationId"})

/// JobDetail relation to job material
JobDetail.hasMany(JobMaterial, {foreignKey: "JobId"})
JobMaterial.belongsTo(JobDetail, {foreignKey: "JobId"})

/// JobDetail relation job Tube material
JobDetail.hasMany(JobTubeMaterial, {foreignKey: "JobId"})
JobTubeMaterial.belongsTo(JobDetail, {foreignKey: "JobId"})

/// JobDetail relation to freeissue Material
JobDetail.hasMany(FreeIssueMaterial, {foreignKey: "JobId"})
FreeIssueMaterial.belongsTo(JobDetail, {foreignKey: "JobId"})

/// JobDetail relation to JobOutsourcing
JobDetail.hasMany(JobOutsourcing, {foreignKey: "JobId"})
JobOutsourcing.belongsTo(JobDetail, {foreignKey: "JobId"})

/// OutsourcingCompany relation to JobOutsourcing
OutsourcingCompany.hasMany(JobOutsourcing, {foreignKey: "OCompanyId"})
JobOutsourcing.belongsTo(OutsourcingCompany, {foreignKey: "OCompanyId"})

/// Outsourcing relation to JobOutsourcing
Outsourcing.hasMany(JobOutsourcing, {foreignKey: "OutsourcingId"})
JobOutsourcing.belongsTo(Outsourcing, {foreignKey: "OutsourcingId"})

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