import dotenv from "dotenv"
import {connectDB, sequelise} from "./db/index.js"
import {app} from "./app.js"
import { Company } from "./models/company.model.js"
import { Location } from "./models/location.model.js"
import{ User } from "./models/user.model.js"


dotenv.config({
    path: "./.env"
})

connectDB()

.then(()=>{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`Server is running at port : ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Database connection Failed!!", err)
})


//   sequelise.sync({alter: true}).then((data)=>{
//      console.log("Tabel and model synced successfully")
//  })
//   .catch((err)=>{
//       console.log("Error syncing the table and model", err)
//   })
