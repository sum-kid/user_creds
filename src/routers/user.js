const express=require('express');
const { signup, signin, signout, resetPassword } = require('../controllers/auth');
const {protectRoute}=require('../middleware/authHelper');
const userRouter=express.Router();

userRouter.route('/signup')
    .post(signup);

userRouter.route('/signin')
    .post(signin);

userRouter.use(protectRoute);
userRouter.route('/signout')
    .get(signout);

userRouter.route('/resetPassword/:id')
    .post(resetPassword);

module.exports=userRouter;