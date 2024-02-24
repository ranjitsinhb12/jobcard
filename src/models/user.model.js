import { DataTypes, Model } from "sequelize";
import {sequelise} from "../db/index.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Location, Company } from "./company.model.js"

const User = sequelise.define("User", {
       UserId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
       },
       FullName:{ 
        type: DataTypes.STRING,
        allowNull: false
        },
       UserMobile:{
        type: DataTypes.STRING,
        allowNull: false
       },
       UserEmail:{
        type: DataTypes.STRING,
        allowNull: false,
        isLowercase: true,
        isEmail: true,
        unique: true
       },
        UserName:{
        type: DataTypes.STRING,
        allowNull: false,
        isLowercase: true,
        unique: true
        },
        UserPassword:{
            type: DataTypes.STRING,

            validate: {
                async isPasswordCorrect (UserPassword){
                   return await bcrypt.compare(UserPassword, this.UserPassword)
                }
           }
        },
        UserStatus:{
            type: DataTypes.STRING,
            defaultValue: "A"
        },
        Avatar:{
            type: DataTypes.STRING,
            allowNull: true
        },
        RefreshToken:{
            type: DataTypes.STRING
        },
        PayRates:{
            type: DataTypes.FLOAT
        },
        PayMethod:  {
            type: DataTypes.STRING
        }
       
}, 
{
    timestamps: true
});

User.generateAccessToken = function(UserId){
    return jwt.sign(
        {
            UserId: this.UserId,
            UserName: this.UserName,
            UserEmail: this.UserEmail
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

User.generateRefreshToken = function(UserId){
    return jwt.sign(
        {
            UserId: this.UserId,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const UserLocation = sequelise.define("UserLocation",{
    UserLocationId:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    LocationStatus: {
        type: DataTypes.STRING,
        defaultValue: "A"
    },
    DefaultLocation:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{timestamps: false})

const Roles = sequelise.define("Roles",{
    RoleId:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    RoleName:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps: false
})

Company.hasMany(User, {foreignKey: "CompanyId"})
User.belongsTo(Company, {foreignKey: "CompanyId"})

Location.belongsToMany(User, {
    through: UserLocation,
    foreignKey: "LocationId"

})
User.belongsToMany(Location,{ 
    through: UserLocation,
    foreignKey: "UserId"
})

Roles.hasMany(User,{
    foreignKey: "RoleId"
})


export { User, UserLocation, Roles }