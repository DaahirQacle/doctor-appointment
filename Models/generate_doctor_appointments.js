import mongoose from "mongoose";

const appointments_schema=mongoose.Schema({
    doctor_id:{type:mongoose.Types.ObjectId},
    appointments:{type:Array}
},{timestamps:true})

const generated_doctor_appointments=mongoose.model("generated_doctor_appointments", appointments_schema)
export default generated_doctor_appointments