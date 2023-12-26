import { DataTypes, Model } from "sequelize";
import {sequelise} from "../db/index.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Location } from "./location.model.js"

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
        isEmail: true
       },
        UserName:{
        type: DataTypes.STRING,
        allowNull: false,
        isLowercase: true
        },
        UserPassword:{
            type: DataTypes.STRING
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
        }
}, 
{
    timestamps: true
});


User.isPasswordCorrect = async function(UserPassword){
    return await bcrypt.compare(UserPassword, this.UserPassword)
}

User.generateAccessToken = function(){
    return jwt.sign(
        {
            UserId: this.UserId,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

User.generateRefreshToken = function(){
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
    }
},{timestamps: false})

Location.belongsToMany(User, {
    through: UserLocation,
    foreignKey: "LocationId"

})
User.belongsToMany(Location,{ 
    through: UserLocation,
    foreignKey: "UserId"
})

export { User, UserLocation }