import  Jwt  from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import Admin from "../modals/admin.modal.js";


export const verifyJWTAdmin = async(req, _, next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", " ");

    if (!token) {
         throw new ApiError(401, "Unauthorized request")
        
    }

    const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const admin = await Admin.findByPk(decodedToken?.id, {
        attributes: {exclude: ['password']}
     })

  

    if(!admin){
        throw new ApiError(401, "Invalid Access Token");
    }


    req.user= admin;
    next()
    

}