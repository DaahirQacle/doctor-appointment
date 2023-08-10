import mongoose from 'mongoose'

const registerSchema = mongoose.Schema(
    {
        name:{type:String ,required:true},
        email:{ type: String, required: true, unique: true, lowercase: true},
        password:{ type: String, required: true},
        phone:{type:Number , required:true,unique:true},
       
    },{timestamps:true}
);

const Register = mongoose.model('Register' , registerSchema)

export default Register

