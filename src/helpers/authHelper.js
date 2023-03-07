const jwt=require('jsonwebtoken');
const env=require('dotenv');
env.config();
//checking if user is logged in or not
module.exports.protectRoute=function protectRoute(req,res,next){
    //authenticating the user
    if(req.cookies.login){
        let isVerified=jwt.verify(req.cookies.login,process.env.JWT_SECRET_KEY);
        if(isVerified){
            next();
        }
        else{
            return res.json({
                message:"User not verified"
            });
        }
    }
    else{
        return res.json({
            message:'Operation not allowed!!Please login'
        });
    }
}