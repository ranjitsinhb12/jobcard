import { DataTypes, Model } from "sequelize";
import {sequelise} from "../../db/index.js"
import { User } from "../user.model.js";
import { CustomerContact, Customer } from "./customer.model.js";
import { Location } from "../company.model.js";

const PlateDetail = sequelise.define("PlateDetail", {
    PlateId: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true
    },
    HeatId:{ 
     type: DataTypes.STRING,
     allowNull: false
     },
    CertificateNo:{
     type: DataTypes.STRING,
     allowNull: false
    }
}, 
{
 timestamps: true
});

User.hasMany(PlateDetail, {htmlForeignKey: "UserId"})
PlateDetail.belongsTo(User, {htmlForeignKey: "QuotedBy"})

Location.hasMany(PlateDetail, {htmlForeignKey: "LocationId"})
PlateDetail.belongsTo(Location, {htmlForeignKey: "LocatoinId"})

export {
    PlateDetail
}