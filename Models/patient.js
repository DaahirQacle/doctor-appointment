import mongoose from 'mongoose'

const patientSchema = mongoose.Schema(
    {
        name:{type:String ,required:true},
        address:{type:String ,required:true},
        Responsiblephone:{type:Number , required:true,unique:true},
        ResponsibleName:{type:String , required:true},
        age:Number
    },{timestamps:true}
);

const Patient = mongoose.model('patient' , patientSchema)

export default Patient

