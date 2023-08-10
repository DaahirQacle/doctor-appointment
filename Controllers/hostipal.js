import mongoose from "mongoose";
import { admin } from "../Models/admin.js";
import Hospitals from "../Models/hosbitals.js";
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary'
import Departments from "../Models/departments.js";
import Doctors from "../Models/doctors.js";
const createHospital = async (req, res) => {
    try {
      const salt = await bcrypt.genSaltSync(10);
      let {hospitalName,
        managerName,
        phone,
        email,
        logo,
        image,
        address,
        description,
        telephone,
        admin_id,
        emergency_capacity,
        emergency}=req.body
      const imageRes = await cloudinary.uploader.upload(image, {
        folder: 'Images'
      });
      const logoRes = await cloudinary.uploader.upload(logo, {
        folder: 'Images'
      });
  
      let hospital = await new Hospitals({
        hospitalName: hospitalName.trim().toLowerCase(),
        // user_name: req.body.user_name.trim().toLowerCase(),
        managerName: managerName.trim().toLowerCase(),
        phone,
        email: email.trim().toLowerCase(),
        image: {public_id:imageRes.public_id,url:imageRes.secure_url},
        logo: {public_id:logoRes.public_id, url:logoRes.secure_url},
        address,
        description,
        telephone,
        admin_id,
        emergency,
        emergency_capacity
      }).save();
  
      let admin_ = await new admin({
        full_name: req.body.managerName.trim().toLowerCase(),
        user_name: req.body.user_name.trim().toLowerCase(),
        phone: req.body.phone,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
        admin_type:2,
        status:req.body.status,
        hospital_id:hospital._id,
      }).save();
  
      res.status(200).json({ message: 'Created Successfully', success: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message, success: false });
    }
  };

  const updateHospital = async (req, res) => {
    try {
      let {hospitalName,
        managerName,
        phone,
        user_name,
        email,
        logo,
        image,
        address,
        description,
        telephone,
        admin_id,
        emergency_capacity,
        emergency}=req.body

      if(image===null && logo===null){
        await Hospitals.findByIdAndUpdate({_id:req.params.id},{hospitalName,
          managerName,
          phone,
          email,
          address,
          description,
          telephone,
          admin_id,
          emergency_capacity,
          emergency}, { new: true }).then((hospital)=>{
          if(hospital){
             admin.findOneAndUpdate({ hospital_id: req.params.id }, { user_name: user_name }, { new: true }).select({user_name:1}).then((admin)=>{
             if(admin){
              res.status(200).json({success:true, message: 'Updated Successfully',updated_hospital:hospital, updated_admin:admin });
             }else{
    res.status(200).json({success:false, message:'Admin Not Found'})
             }
            },(error)=>{
              res.status(500).json({success:false, message:error.message})
            })
          }else{
            res.status(200).json({success:false, message:'No Hospital Found'})
          }
         },(error)=>{
          res.status(500).json({success:false, message:error.message})
         });
      }
      else if(image!==null){
        let imageRes = await cloudinary.uploader.upload(image, {
          folder: 'Images'
        });
       image= {
          public_id: imageRes.public_id,
          url: imageRes.secure_url
        }
        await Hospitals.findByIdAndUpdate({_id:req.params.id},{hospitalName,
          managerName,
          phone,
          email,
          image,
          address,
          description,
          telephone,
          admin_id,
          emergency_capacity,
          emergency}, { new: true }).then((hospital)=>{
          if(hospital){
             admin.findOneAndUpdate({ hospital_id: req.params.id }, { user_name: user_name }, { new: true }).select({user_name:1}).then((admin)=>{
             if(admin){
              res.status(200).json({success:true, message: 'Updated Successfully',updated_hospital:hospital, updated_admin:admin });
             }else{
    res.status(200).json({success:false, message:'Admin Not Found'})
             }
            },(error)=>{
              res.status(500).json({success:false, message:error.message})
            })
          }else{
            res.status(200).json({success:false, message:'No Hospital Found'})
          }
         },(error)=>{
          res.status(500).json({success:false, message:error.message})
         });
      }else if(logo!==null){
        let logoRes = await cloudinary.uploader.upload(logo, {
          folder: 'Images'
        });
        logo= {
          public_id: logoRes.public_id,
          url: logoRes.secure_url
        }
        await Hospitals.findByIdAndUpdate({_id:req.params.id},{hospitalName,
          managerName,
          phone,
          email,
          address,
          logo,
          description,
          telephone,
          admin_id,
          emergency_capacity,
          emergency}, { new: true }).then((hospital)=>{
          if(hospital){
             admin.findOneAndUpdate({ hospital_id: req.params.id }, { user_name:user_name }, { new: true }).select({user_name:1}).then((admin)=>{
             if(admin){
              res.status(200).json({success:true, message: 'Updated Successfully',updated_hospital:hospital, updated_admin:admin });
             }else{
    res.status(200).json({success:false, message:'Admin Not Found'})
             }
            },(error)=>{
              res.status(500).json({success:false, message:error.message})
            })
          }else{
            res.status(200).json({success:false, message:'No Hospital Found'})
          }
         },(error)=>{
          res.status(500).json({success:false, message:error.message})
         });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message, status: false });
    }
  };

 const deleteHospital = async(req,res)=>{
    try {
        await Hospitals.findByIdAndDelete({_id:req.params.id})
        await admin.findOneAndDelete({hospital_id:req.params.id})
        await Departments.deleteMany({hospital_Id:req.params.id})
        await Doctors.deleteMany({hospital_Id:req.params.id})
        res.status(200).json({message:'Deleted Successfully',status:true})
    } catch (error) {
        res.status(500).json({message:error,status:false})
    }
}


 const fetchHospital = async(req,res)=>{
    try {
     let admin_lookup ={
      $lookup: {
        from: "admins",
        localField: "_id",
        foreignField: "hospital_id",
        as: "admin",
      },
    };
    const unwind_admin = {
      $unwind: "$admin",
    };
    const project = {
      $project: {
        _id: 1,
        hospitalName: 1,
        phone: 1,
        telephone: 1,
        user_name: '$admin.user_name',
        logo: 1,
        image: 1,
        email:1,
        address: 1,
        managerName: 1,
        description: 1,
        is_open:1,
        emergency:1,
        is_approved:1,
        createdAt:1,
        emergency_capacity:1
      },
    };
      await Hospitals.aggregate([admin_lookup, unwind_admin, project]).sort({createdAt:-1}).then((hospitals)=>{
        if(hospitals){
          res.status(200).json({data:hospitals,success:true})
        }
        else{
          res.status(200).json({success:false, message:'No Hospitals Found'})
        }
      },
      (error)=>{
        res.status(500).json({success:false, message:error.message})
      })
          
    } catch (error) {
        res.status(500).json({message:error.message,success:false})
    }
}

 export const fetchHospitals_for_app = async(req,res)=>{
    try {
        let match={
          $match:{
            'is_open':{
              $eq:true
            },
            'has_departments':{
              $eq:true
            },
            'has_doctors':{
              $eq:true
            }
          }
        }
        let sort={
          $sort:{
            createdAt:1
          }
        }
           await Hospitals.aggregate([match]).then((hospitals)=>{
            if(hospitals){
              res.status(200).json({data:hospitals,success:true})
            }
            else{
              res.status(200).json({success:false, message:'No Hospitals Found'})
            }
           },(error)=>{
            res.status(200).json({success:false, message:'No Hospitals Found'})
           })
    } catch (error) {
        res.status(500).json({message:error.message,success:false})
    }
}

    export const get_hospitals_report=async(req, res)=>{
    try{
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
        let sort={
            $sort:{createdAt:-1}
        }
        let department_lookup={
          $lookup: {
            from: 'departments',
            localField: '_id',
            foreignField: 'hospital_Id',
            as: 'departments',
          },
        }
        let doctor_lookup={
          $lookup: {
            from: 'doctors',
            localField: '_id',
            foreignField: 'hospital_Id',
            as: 'doctors',
          },
        }
        let admin_lookup={
          $lookup: {
            from: 'admins',
            localField: '_id',
            foreignField: 'hospital_id',
            as: 'admin',
          },
        }
        let unwind_admin={
          $unwind:'$admin'
        }
        let project={
          $project: {
            name: 1,
            hospitalName:1,
            address:1,
            email:1,
            phone:1,
            managerName:1,
            telephone:1,
            emergency:1,
            user_name:"$admin.user_name",
            departmentCount: { $size: '$departments' },
            doctorCount: { $size: '$doctors' },
            emergency:1,
            emergency_capacity:1,
            is_approved:1,
            is_open:1
          },
        }
        Hospitals.aggregate([filter,department_lookup, admin_lookup, unwind_admin,doctor_lookup,project, sort]).then((hospital_data)=>{
            if(hospital_data){
          res.status(200).json({data:hospital_data, success:true, message:'Success'})
            }
            else{
                res.status(404).json({data:[], success:false})
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message, status: false });
      }
    }

    export const get_hospital_by_id = async (req, res) => {
      try {
        const id = req.params.id;
        const admin_lookup = {
          $lookup: {
            from: "admins",
            localField: "_id",
            foreignField: "hospital_id",
            as: "admin",
          },
        };
        const unwind_admin = {
          $unwind: "$admin",
        };
        const project = {
          $project: {
            _id: 1,
            hospitalName: 1,
            phone: 1,
            telephone: 1,
            user_name: '$admin.user_name',
            logo: 1,
            image: 1,
            email:1,
            address: 1,
            managerName: 1,
            description: 1,
            is_open:1,
            emergency:1,
            is_approved:1,
            createdAt:1,
            emergency_capacity:1
          },
        };
        let filter={
          $match:{
            '_id':{
              $eq:new mongoose.Types.ObjectId(id)
            }
          }
        }
      await Hospitals.aggregate([filter, admin_lookup, unwind_admin,project]).then((hospital)=>{
        if(hospital){
          res.status(200).json({success:true, message:"Success", data:hospital})
        }
        else{
          res.status(200).json({success:false, message:'No Hospital Found'})
        }
      }, (error)=>{
        res.status(200).json({success:false, message:error.message})
      })
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message, success: false });
      }
    };


export const edit_hospital_profile = async (req, res) => {
    try {
      let imageRes
      if(req.body.image){
         imageRes = await cloudinary.uploader.upload(req.body.image, {
          folder: 'Images'
        });
        req.body.image= {
          public_id: imageRes.public_id,
          url: imageRes.secure_url
        }
      }
      let logoRes
      if(req.body.logo){ 
        logoRes = await cloudinary.uploader.upload(req.body.logo, {
        folder: 'Images'
      });
      req.body.logo={
        public_id: logoRes.public_id,
        ulr: logoRes.secure_url
      }
    }
      const req_body = req.body;
   await Hospitals.findByIdAndUpdate({ _id: req.body.hospital_id }, req_body, { new: true });
      const updated_admin=await admin.findOneAndUpdate({hospital_id:req.body.hospital_id}, {user_name:req.body.user_name.trim().toLowerCase(),
      }, {new:true})
      return res.status(200).json({ success: true, message: 'Successfully Edited Hospital Profile', updatedHospital: updatedHospital, updated_admin:updated_admin });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  export const get_emergency_hospitals=async(req, res)=>{
    try{
    let match={
      $match:
      {
        "emergency":{
          $eq:true
        },
        "is_open":{
          $eq:true
        }
      }
    }
    await Hospitals.aggregate([match]).then((emergency_hospitals)=>{
      if(emergency_hospitals){
        res.status(200).json({success:true, message:'Success', data:emergency_hospitals})
      }
    }, (error)=>{
      res.status(200).json({success:false, message:'No Hospitals Found'})
    })
    }catch(error){
      res.status(500).json({success:false, })
    }
  }

  export const open_or_close_hospital=async(req, res)=>{
    try{
     let {hospital_id, is_open}=req.body;
    await Hospitals.findByIdAndUpdate({_id:hospital_id}, {is_open:is_open}, {new:true}).then((hospital)=>{
      if(hospital){
        res.status(200).json({success:true, message:"Successfully Updated Hospital", data:hospital})
      }else{
        res.status(200).json({success:false, message:'Hospital Not Found'})
      }
    },(error)=>{
      res.status(200).json({success:false, message:'Hospital Not Found'})
    })
    }catch(error){
      res.status(500).json({success:false, message:error.message})
    }
  }


  export const update_hospital_emergency=async(req, res)=>{
    try{
     let {hospital_id, emergency}=req.body;
    await Hospitals.findByIdAndUpdate({_id:hospital_id}, {emergency:emergency}, {new:true}).then((hospital)=>{
      if(hospital){
        res.status(200).json({success:true, message:"Successfully Updated Hospital", data:hospital})
      }else{
        res.status(200).json({success:false, message:'Hospital Not Found'})
      }
    },
    (error)=>{
      res.status(200).json({success:false, message:'Hospital Not Found'})
    })

    }catch(error){
      res.status(500).json({success:false, message:error.message})
    }
  }
export const approve_decline_hospital=async(req, res)=>{
  try{
  let hospital_id=req.body.hospital_id
  let is_approved=req.body.is_approved
  await Hospitals.findOneAndUpdate({_id:hospital_id},{is_approved:is_approved},{new:true}).then((hospital)=>{
    if(hospital){
      res.status(200).json({success:true, message:'Successfully Updated Hospital', data:hospital})
    }else{
      res.status(200).json({success:false, message:'No Hospital Found'})
    }
  },(error)=>{
    res.status(500).json({success:false, message:error.message})
  })
  }catch(error){
    res.status(500).json({success:false, message:error.message})
  }
}

export const loginUsers = async(req,res)=>{
  try {
      const{user_name , password} = req.body
       if(!user_name || !password){
          return  res.status(200).json({message:"Please Provide all Values" ,success:false})
      }
      const user = await admin.findOne({user_name})
      if(!user){
         return res.status(200).json({message:"Invalid Username" ,success:false , })
      }
      const isCorrect = await bcrypt.compareSync(password,user.password)
      if(!isCorrect){
          return  res.status(200).json({message:"Invalid Password" ,success:false})
      }
     await admin.findOneAndUpdate({user_name}, {logged_at:new Date()}, {new:true})
      const token = user.createJWT()
      res.status(200).json({user:{
          userId:user.hospital_id,
          admin_type:user.admin_type,
          user_name:user.user_name,
          current_user:user._id,
          status:user.status,
          phone:user.phone,
      },token , success:true ,message:"Successfully login..."})
  } catch (error) {
      console.log(error);
  }
}

export{createHospital , updateHospital,deleteHospital,fetchHospital}

