import mongoose from "mongoose";
import autoIncrement from 'mongoose-sequence' 

const appointment_schema = mongoose.Schema({
    //serial_number: Number,
    patient_name: { type: String },
    sex: { type: String },
    age: { type: Number },
    address: { type: String },
    responsive_person: { type: String },
    responsive_person_phone: { type: Number },
    appointment_time:{ type: String },
    doctor_id: { type: mongoose.Types.ObjectId },
    hospital_id:{type:mongoose.Types.ObjectId},
    appointment_fee:{type:Number},
    user_id: { type: mongoose.Types.ObjectId },
    status:{type:Number, default:1},
    cancel_reason:{type:String, default:''}
}, { timestamps: true })
//appointment_schema.plugin(autoIncrement(mongoose), { inc_field: 'serial_number', start_seq: 1 });
const appointment=mongoose.model("appointment", appointment_schema)
export default appointment