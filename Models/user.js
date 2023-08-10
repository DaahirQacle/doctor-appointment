import mongoose from "mongoose";

const user_schema=mongoose.Schema({
    user_name:{type: String, required: true},
    phone:{type: Number, required:true},
    password:{type:String}
}, {timestamps:true})

export const user=mongoose.model('user', user_schema)