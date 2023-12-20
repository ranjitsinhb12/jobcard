import { DataTypes, Model } from "sequelize";
import {sequelise} from "../db/index.js"
import { ApiError } from "../utils/ApiError.js";



const Company = sequelise.define("Company", {
       id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
       },
       companyName:{ 
        type: DataTypes.STRING,
        allowNull: false
        },
       companyStatus: {
           type: DataTypes.STRING,
            defaultValue: "A"
       },
       companyLogo:{
            type: DataTypes.STRING,
            allowNull: true
       }
    
}, {timestamps: true});


    
 export {Company}




// class Location extends Model{}

// Location.init({
//     id:{
//         autoIncrement: true,
//         primaryKey: true
//     },
//     locationName: DataTypes.STRING,
//     locationAddress: DataTypes.STRING,
//     locationStatus:{
//         type: DataTypes.STRING,
//         defaultValue: "A"
//     }
// }, {
//     sequelise
// })



// Sequelize.async()
// .then(()=>{
//     console.log("Database Created")
// })

// .catch((err)=>{
//     console.log("Error: ", err)
// })

// export {Company, Location}



// // class Company extends Model{}

// Company.init({
//     id: {
//         primaryKey: true,
//         autoIncrement: true
//    },
//    companyName: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//    companyStatus: {
//        type: DataTypes.STRING,
//         defaultValue: "A"
//    }
// },{
//     sequelise
// })


// const Company = sequelise.define("Company", {
//    id: {
//         primaryKey: true,
//         autoIncrement: true
//    },
//    companyName: DataTypes.STRING,
//    companyStatus: {
//        type: DataTypes.STRING,
//         defaultValue: "A"
//    }

// }, {timestamps: true});

// export { Company }