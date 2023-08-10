import mongoose from "mongoose";

const departmentSchema = mongoose.Schema(

    {
        deptName:{type:String ,required:true},
        deprtImage:{
            public_id:{type:String},
            url:{type:String}
        },
        description:{type:String ,required:true},
        hospital_Id: {
            type: mongoose.Types.ObjectId,
            ref: 'hospitals',
            required:true
          },
          has_doctors:{type:Boolean, default:false}
    },
    
    {timestamps:true});

const Departments = mongoose.model("department" ,departmentSchema )

export default Departments