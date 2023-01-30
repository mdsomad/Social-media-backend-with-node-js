const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");



//TODO Check loggedInUser isAuthenticated Create Function
exports.isAuthenticated = async(req, resp, next) => {        //* <-- Is function Mein Bearer mein token Send Nahin kar sakte frontend sa

    
    try {
     const {token} = req.cookies;
        if(!token){
            return resp.status(401).json({
                message:"Please login first"
            })
        }
    
        const decoded = await jwt.verify(token,process.env.JWT_SECRET_KEY);
    
        req.user = await User.findById(decoded._id);  //* <-- Authenticated user _id send
        next();

    } catch (error) {
        resp.status(500).json({ status:false, message:`Server Error : ${error.message}`})
    }
  
 }