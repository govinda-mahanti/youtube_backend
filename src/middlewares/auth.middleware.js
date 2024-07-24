import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"



export const verifyJWT = asyncHandler(async (req, res, next)=>{
    try {
        const token=req.cookie?.accessToken|| req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
    
        const decodedToken= jwt.verify(token, proccess.env.ACCESS_TOKEN_SECRET) 
    
        const user= await User.findById(decodedToken._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "invalid access Token")
        }
    
        req.user=user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message|| "invalid access Token")
    }
})