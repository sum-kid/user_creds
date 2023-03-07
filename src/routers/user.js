const express=require('express');
const { signup, signin } = require('../controllers/auth');
const userRouter=express.Router();

userRouter.route('/signup')
    .post(signup);

userRouter.route('/signin')
    .post(signin);

module.exports=userRouter;