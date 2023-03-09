const express=require('express');
const userModel=require('../models/userModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const env=require('dotenv');
env.config();

module.exports.signup=async function signup(req,res){
    try{
        let dataObj=req.body;
        //encrypt the password here
        let attributes=[];
        for(let data in dataObj){
            attributes.push(data);
        }
        let user=new userModel();
        for(let i=0;i<attributes.length;i++){
            user[attributes[i]]=dataObj[attributes[i]];
        }
        user.createResetToken();
        await user.save();
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
      //  console.log(user.resetToken);
        if(user){
            const isMatch=await bcrypt.compare(data.password,user.password);
            if(isMatch){
                let uid=user._id;
                let token=jwt.sign({payload:uid},process.env.JWT_SECRET_KEY);
                res.cookie('login',token,{httpOnly:true});
                return res.json({
                    message:"User signed-in",
                    data:user,
                    cookie:req.cookies.login
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

module.exports.signout=function signout(req,res){
    try{
       // console.log(req.cookies.loger);
        res.cookie('login','',{maxAge:1});
        res.json({
            message:"User signed-out successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.resetPassword=async function resetPassword(req,res){
    try{
        const id=req.params.id;
        let {oldPassword,newPassword,confirmnewPassword}=req.body;
        const user=await userModel.findById(id);
        //console.log(user);
        if(user){
            const isMatch=await bcrypt.compare(oldPassword,user.password);
            if(isMatch){
                user.resetPasswordHandler(newPassword,confirmnewPassword);
                await user.save();
                return res.json({
                    message:"Password changed successfully"
                });
            }
            else{
                return res.json({
                    message:"Please enter correct password to change your password"
                });
            }
        }
        else{
            return res.json({
                message:"Please login again"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.forgotPassword=async function forgotPassword(req,res){
    try{
        //the token which is sent over the mail and this token is reset after every mail
        const token=req.params.token;
        let {password,confirmPassword}=req.body;
        const user=await userModel.findOne({resetToken:token});
        if(user){
            user.resetPasswordHandler(password,confirmPassword);
            user.createResetToken();
            await user.save();
            return res.json({
                message:"Password changed successfully"
            });
        }
        else{
            return res.json({
                message:"User not found!!Please sign-up"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}