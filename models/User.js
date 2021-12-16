const mongoose = require('mongoose')

const UserSchema=new mongoose.Schema({
    fName:{type:String},
    lName:{type:String},
    email:{type:String},
    otp:{type:Number},
    phone:{
        type:Number,
        required: true,
        validate: {
          validator: Number.isInteger,
          message: '{VALUE} must be an integer',
        },},
    pwd:{type:String}
})

const UserModel=mongoose.model('User',UserSchema)
module.exports=UserModel;