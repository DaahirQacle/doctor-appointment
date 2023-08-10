import mongoose, { Mongoose } from "mongoose";

const emergency_schema=mongoose.Schema({
    patient_name:{type:String},
    //sex:{type:Number},
    address:{type:String},
    phone:{type:Number},
    need_ambulance:{type:Boolean},
    hospital_id:{type:mongoose.Types.ObjectId},
    status:{type:Number, default:1 },
}, {timestamps:true})

const emergency=mongoose.model('emergency', emergency_schema)
export default emergency