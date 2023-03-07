const userModel=require('../models/userModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const env=require('dotenv');
env.config();

module.exports.signup=async function signup(req,res){
    try{
        let dataObj=req.body;
        //encrypt the password here
        let user=await userModel.create(dataObj);
        if(user){
            return res.json({
                message:"User signed up successfully",
                data:user
            })
        }
        else{
            return res.json({
                message:"Error while signing-up"
            })
        }
                
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.signin=async function signin(req,res){
    try{
        let data=req.body;
        let user=await userModel.findOne({email:data.email});
        if(user){
            const isMatch=await bcrypt.compare(data.password,user.password);
            if(isMatch){
                let uid=user._id;
                let token=jwt.sign({payload:uid},process.env.JWT_SECRET_KEY);
                res.cookie('login',token,{httpOnly:true});
                return res.json({
                    message:"User signed-in",
                    data:user
                });
            }
            else{
                return res.json({
                    message:"Please enter correct password"
                });
            }
        }
        else{
            return res.status(404).json({
                message:"Please enter valid email"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}