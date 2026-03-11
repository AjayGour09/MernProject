import jwt from 'jsonwebtoken'
import {ENV} from '../config/env.js'

export function protect (req,res ,next){
    try {
        const authHeader =req.headers.authorization ||""
        const token = authHeader.startswith("Bearer ")?authHeader.split(" ")[1]:null;

        if(!token){
            return res.status(401).json({message:"No Token Provided"})
        }

        const decoded = jwt.verify(token,ENV.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message:"Invalid or expire token"})
    }
} 



export function adminOnly(req,res,next){
    if(!req.user ||req.user.role !=="admin"){
        return res.status(403).json({message:"Admin Access only"})
    }
    next();
}
export function customerOnly(req, res, next) {
  if (!req.user || req.user.role !== "customer") {
    return res.status(403).json({ message: "Customer access only" });
  }
  next();
}