import mongoose from "mongoose";
// import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';
export const admin_schema=mongoose.Schema({
    full_name:{type:String},
    phone:{type:Number},
    email:{type:String},
    user_name:{type:String},
    password:{type:String},
    admin_type:{type:Number},
    hospital_id:{type:mongoose.Types.ObjectId},
    status:{type: Number, default:1},
    logged_at: { type: Date, default: null },
},
{timestamps:true})
admin_schema.methods.createJWT =  function(){
    return  jwt.sign({userId:this._id} , process.env.JWT_SECRETC_KEY)
}
export const admin=mongoose.model('admin', admin_schema)