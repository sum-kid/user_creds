const mongoose=require('mongoose');
const emailValidator=require('email-validator');
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
const env=require('dotenv');
env.config();

mongoose.set('strictQuery', true);

mongoose.connect(process.env.db_link)
    .then(function(){
        console.log('Connected to User database');
    })
    .catch(function(err){
        console.log(err);
    });

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"]
    },
    email:{
        type:String,
        required:[true,"Email-id is required"],
        unique:[true,"Email-id already in use"],
        validate:[function(){
           return emailValidator.validate(this.email);
        },"Valid email-id is required"]
    },
    password:{
        type:String,
        minLength:8,
        required:[true,"Password is required"]
    },
    confirmPassword:{
        type:String,
        minLength:8,
        required:[true,"Confirm Password is required"],
        validate:[function(){
            return this.password==this.confirmPassword;
        }," Confirm Password ans Password must be same"]
    },
    role:{
        type:String,
        enum:["super-admin","admin","user"],
        default:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    profileImage: {
        type: String,
        default: 'img/users/default.jpeg'
    },
    resetToken: {
        type:String,
        default:''
    }
});

userSchema.pre('save',async function(next){
    //only if password field is modified than only hash will be generated
    if(this.isModified('password')){
        const hashedPassword=await bcrypt.hash(this.password,10);
        this.password=hashedPassword;
        this.confirmPassword=undefined;
    }
    next();
});

userSchema.methods.createResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.resetToken=resetToken; 
}

userSchema.methods.resetPasswordHandler=function(password,confirmPassword){
    this.password=password;
    this.confirmPassword=confirmPassword;
    this.resetToken=undefined;
}

const userModel=mongoose.model('userModel',userSchema);

module.exports=userModel;