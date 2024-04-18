import  Jwt  from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import User from "../modals/user.modals.js";


export const verifyJWT = async(req, _, next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", " ");

    if (!token) {
         throw new ApiError(401, "Unauthorized request")
        
    }

    const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findByPk(decodedToken?.id, {
        attributes: {exclude: ['password', 'refreshToken']}
     })

  

    if(!user){
        throw new ApiError(401, "Invalid Access Token");
    }


    req.user= user;
    next()
    

}