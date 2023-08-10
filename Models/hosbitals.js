import mongoose from 'mongoose'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
const HospitalSchema = mongoose.Schema(
    {
        hospitalName:{type:String ,required:true},
        description:{type:String},
        address:{type:String ,required:true},
        email:{ type: String, required: true, unique: true},
        phone:{type:Number , required:true,unique:true},
        telephone:{type:Number , required:true,unique:true},
        managerName:{type:String ,required:true},
        image:{public_id:{type:String}, url:{type:String}},
        logo:{public_id:{type:String}, url:{type:String}},
        is_open:{type:Boolean, default:true},
        has_departments:{type:Boolean, default:false},
        has_doctors:{type:Boolean, default:false},
        emergency:{type:Boolean, default:true},
        emergency_capacity:{type:Number},
        is_approved:{type:Boolean, default:false}
    },{timestamps:true}
);
// HospitalSchema.pre('save' , async function(){
//     const salt = await bcrypt.genSalt(10)
//     this.password = await bcrypt.hash(this.password ,salt)
// })

// HospitalSchema.methods.createJWT =  function(){
//     return  jwt.sign({userId:this._id} , process.env.JWT_SECRETC_KEY)
// }

// HospitalSchema.methods.comparePassword =  function(password){
//     return bcrypt.compareSync(this.password , password) 
// }
const Hospitals = mongoose.model('hospital' , HospitalSchema)

export default Hospitals

