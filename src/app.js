const express=require('express');
const app=express();
const cookieParser=require('cookie-parser');
const env=require('dotenv');
env.config();
const userModel=require('./models/userModel');


const PORT=process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

const server=async ()=>{
    try{
        app.listen(PORT,()=>{
            console.log(`Server is running on PORT ${PORT}`);
        });
    }
    catch(err){
        console.log(err);
    }
};

server();

const userRouter=require('./routers/user');

app.use('/user',userRouter);