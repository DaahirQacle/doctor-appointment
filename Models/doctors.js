import mongoose from "mongoose";

const doctorModel = mongoose.Schema({
    doctorName: {type:String, required:true},
    age:Number,
    sex:String,
    martialStatus:String,
    address: {type:String, required:true},
    specialist: {type:String, required:true},
    experience: {type:Number, required:true},
    appointments:{type: Array},
    phone:{type:Number, unique:true, required:true},
    image:{public_id:{type:String}, url:{type:String}},
    email:{type:String, unique:true, required:true, lowerCase:true},
    is_active:{type:Boolean, default:true},
    entry_time:{type:String},
    leave_time:{type:String},
    daily_appointments:{type:Number},
    appointments_interval:{type:Number},
    appointment_fee:{type:Number},
    department_Id: {
        type: mongoose.Types.ObjectId,
        ref: 'departments',
        required:true
      },
    hospital_Id: {
        type: mongoose.Types.ObjectId,
        ref: 'hospitals',
        required:true
      }
    
    },{ timestamps:true});

const Doctors = mongoose.model('doctor' ,doctorModel )
export default Doctors;

