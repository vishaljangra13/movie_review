const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique:true
    },
    email :{
        type: String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    contactNo:{
        type: String,
        required: true
    }
}); 
userSchema.plugin(uniqueValidator);

module.exports=mongoose.model('UserModel',userSchema);