import Departments from "../Models/departments.js";
import Hospitals from "../Models/hosbitals.js";
import mongoose from "mongoose";
import cloudinary from "../utilities/cloudinary.js";
 const createDepartment = async(req,res)=>{
    try {
      let {hospital_Id, description, deprtImage, deptName}=req.body;
      const imageRes = await cloudinary.uploader.upload(deprtImage, {
        folder: 'Images'
      });
        const create = await Departments.create({
          hospital_Id,
          description,
          deptName,
          deprtImage:{
            public_id:imageRes.public_id,
            url:imageRes.secure_url
          }
        });
       await Hospitals.findByIdAndUpdate({_id:hospital_Id}, {has_departments:true},{new:true}).then((hospital)=>{
          if(hospital){
            res.status(200).json({message:'Created Successfully',status:true, data:create, hospital:hospital.has_departments})
          }else{
  res.status(200).json({success:false, message:'No Hospital Found'})
          }
        },(error)=>{
          res.status(500).json({success:false, message:error.message})
        })
    } catch (error) {
        res.status(500).json({message:error,status:false})
    }
}

 const updateDepartment = async(req,res)=>{
    try {
      let {description, deprtImage, deptName}=req.body;
      if(deprtImage===null){
        await Departments.findByIdAndUpdate(req.params.id,{description, deptName }, {new: true }).then((department)=>{
          if(department){
            res.status(200).json({success:true, message:'Updated Success Fully', data:department})
          }else{
            res.status(200).json({success:false, message:'Department Not Found',})
          }
         },(error)=>{
          res.status(500).json({success:false, message:error.message,})
         })
      }else{
        let imageRes = await cloudinary.uploader.upload(deprtImage, {
           folder: 'Images'
         });
         deprtImage={
          public_id:imageRes.public_id,
          url:imageRes.secure_url
        }
        await Departments.findByIdAndUpdate(req.params.id,{description, deptName, deprtImage }, {new: true }).then((department)=>{
          if(department){
            res.status(200).json({success:true, message:'Updated Success Fully', data:department})
          }else{
            res.status(200).json({success:false, message:'Department Not Found',})
          }
         },(error)=>{
          res.status(500).json({success:false, message:error.message,})
         })
      }
    } catch (error) {
        res.status(500).json({message:error,status:false})
    }
}

 const deleteDepartment = async(req,res)=>{
    try {
        const data = await Departments.findByIdAndDelete(req.params.id)
        res.status(200).json({message:'Deleted...',status:true})
    } catch (error) {
        res.status(500).json({message:error,status:false})
    }
}

 const fetchDepartment = async(req,res)=>{
    try {
        const data = await Departments.find()
        res.status(200).json({message:data,status:true})
       
    } catch (error) {
        res.status(500).json({message:error,status:false})
    }
}

export const get_departments_report = async (req, res) => {
  try {
    let start_date = req.params.start;
    let end_date = req.params.end;

    if (start_date == "" || start_date == undefined || start_date==null) {
      start_date = new Date(0);
    } else {
      start_date = new Date(start_date);
    }
    
    if (end_date == "" || end_date == undefined || end_date==null) {
      end_date = new Date(); 
    } else {
      end_date = new Date(end_date);
    }

    var filter = {
      $match: {
        createdAt: {
          $gte: start_date,
          $lte: end_date,
        },
      },
    };
    const hospital_lookup = {
        $lookup: {
          from: "hospitals",
          localField: "hospital_Id",
          foreignField: "_id",
          as: "hospital",
        },
      };
      const unwind_hospital = {
        $unwind: "$hospital",
      };

    let sort = { $sort: { createdAt: -1 } };
    let project={
        $project:{
            _id:1,
            deptName:1,
            createdAt:1,
            description:1,
            hospital_name: '$hospital.hospitalName'
        }
    }
    Departments.aggregate([filter,hospital_lookup, unwind_hospital, project, sort]).then((depart_data) => {
      if (depart_data) {
        res.status(200).json({ data: depart_data, success: true });
      } else {
        res.status(404).json({ message:'No Departments Found', success: false });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};
export const get_departments_report_by_hospital_id = async (req, res) => {
  try {
    let start_date = req.params.start;
    let end_date = req.params.end;
    let hospital_id = req.params.hospital_id;

    if (!start_date) {
      start_date = new Date(0);
    } else {
      start_date = new Date(start_date);
      start_date.setHours(0, 0, 0, 0);
    }
    
    if (!end_date) {
      end_date = new Date();
    } else {
      end_date = new Date(end_date);
      end_date.setHours(23, 59, 59, 999); 
    }

    const filter = {
      $match: {
        createdAt: {
          $gte: new Date(start_date),
          $lte: new Date(end_date),
        },
      },
    };


    const sort = { $sort: { createdAt: -1 } };
   await Hospitals.findOne({_id:hospital_id}).then((hospital)=>{
    var hospital_condition = {
      $match: {
        "hospital_Id": {
          $eq:new mongoose.Types.ObjectId(hospital_id),
        },
      },
    };
     Departments.aggregate([hospital_condition, filter, sort]).then((departments)=>{
      if(departments){
      res.status(200).json({success:true, data:departments})
      }
     }, (error)=>{
      res.status(200).json({success:false, message:"No Departments Found"})
     })

   }, (error)=>{
    res.status(200).json({success:false, message:'Hospital Not Found'})
   })
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const get_department_by_id=async(req, res)=>{
  try{
    let id=req.body.id
    const data=await Departments.findById(id)
    res.status(200).json({data:data, success:true})
  }catch(error){
    res.status(500).json({message:error.message, success:false})
  }
}

export const get_departments_by_hospital_id=async(req, res)=>{
  try{
    let hospital_id=req.params.id;
    let data =await Departments.find({hospital_Id: hospital_id}).sort({createdAt:-1})
    res.status(200).json({data, success:true})
  }catch(error){
    res.status(500).json({message:error.message, success:false})
  }
}
export const get_departments_by_hospital_id_for_app=async(req, res)=>{
  try{
    let hospital_id=req.params.id;
    let match = {
      $match: {
        'hospital_Id': {
          $eq: new mongoose.Types.ObjectId(hospital_id)
        },
        'has_doctors':{
          $eq:true
        }
      }
    }
    await Departments.aggregate([match]).sort({createdAt:-1}).then((departments)=>{
      if(departments){
        res.status(200).json({success:true, data:departments, message:'Success'})
      }else{
     res.status(404).json({success:false, message:'No Departments Found'})
      }
    },(error)=>{
      res.status(500).json({success:false, message:error.message})
    })
  }catch(error){
    res.status(500).json({message:error.message, success:false})
  }
}
export const get_departments_those_have_doctor=async(req, res)=>{
  try{
    let hospital_id=req.params.hospital_id
    let match={
      $match:{
        'hospital_Id':{
          $eq:new mongoose.Types.ObjectId(hospital_id)
        }
      }
    }
    let filter={
        $lookup: {
          from: 'doctors',
          localField: '_id',
          foreignField: 'departmentId',
          as: 'doctors'
        },
    }
  await Departments.aggregate([match]).then((departments)=>{
    if(departments){
      res.status(200).json({success:true, message:'Success', data:departments})
    }
    else{
      res.status(200).json({success:false, message:'No Departments Found'})
    }
  },(error)=>{
    res.status(200).json({success:false, message:'No Departments Found'})
  })
  }catch(error){
    res.status(500).json({success:false, message:error.message})

  }
}
export{createDepartment , updateDepartment,deleteDepartment,fetchDepartment}