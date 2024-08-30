//process.loadEnvFile()
//  /$$    /$$  /$$$$$$  /$$   /$$ /$$     /$$ /$$$$$$
// | $$   | $$ /$$__  $$| $$$ | $$|  $$   /$$//$$__  $$
// | $$   | $$| $$  \ $$| $$$$| $$ \  $$ /$$/| $$  \ $$
// |  $$ / $$/| $$$$$$$$| $$ $$ $$  \  $$$$/ | $$$$$$$$
//  \  $$ $$/ | $$__  $$| $$  $$$$   \  $$/  | $$__  $$
//   \  $$$/  | $$  | $$| $$\  $$$    | $$   | $$  | $$
//    \  $/   | $$  | $$| $$ \  $$    | $$   | $$  | $$
//     \_/    |__/  |__/|__/  \__/    |__/   |__/  |__/


import express from "express";
import bodyParser from "body-parser";
import cors from "cors"


import cookieParser from "cookie-parser";
import { JSON_LIMIT } from "./constants.js";

const app = express();
const PORT = process.env.PORT 


// console.log(PORT);

// app.use('/temp', express.static(path.join(__dirname, '/public/temp')));
// app.use(express.static(path.join(__dirname, '/public')));
app.use(cors({
     origin: process.env.CORS_ORIGIN,
     credentials: true
}))

app.use(bodyParser.json())
app.use(express.json({limit:JSON_LIMIT}))
app.use(express.urlencoded({extended:true, limit: JSON_LIMIT}))
app.use(cookieParser())
app.use(express.static("src/public"))



app.get("/", (req, res)=>{
   res.send('<h2>Hello World<h2>')

})

// PROJECT CONTRACT ROUTES
import projectContractRoutes from "./routes/projectContract.routes.js";
app.use("/api/v1/projectContract/", projectContractRoutes)


// PROJECT ROUTES
import projectRoutes from "./routes/project.routes.js";
app.use("/api/v1/project/", projectRoutes)



// STORAGE CONTRACT ROUTES
import storageContractRoutes from "./routes/storageContract.routes.js";
app.use("/api/v1/storageContract/", storageContractRoutes)



// APP IS LISTENING ON PORT 
app.listen(PORT,()=>{
    console.log(`the server is running at port ${PORT}`)
    //192.168.1.29"
})

export {app}






