import { user } from '../Models/user.js';
import bcrypt from 'bcrypt';
import appointment from '../Models/appointment.js';
import mongoose from 'mongoose';
import exp from 'constants';
var salt = bcrypt.genSaltSync(10);

export const register_user=async(req, res)=>{
    try{
     let data=await new user({
            user_name:req.body.user_name.trim().toLowerCase(),
            phone:Number(req.body.phone),
            password: bcrypt.hashSync(req.body.password, salt),
        }).save()
      res.status(200).json({success:true, message:'Successfully Registered User',data:data })
    }catch(error){
        console.log(error)
        res.status(500).json({success:false, message:error.message})}
}

export const update_user = async (req, res) => {
    try {
      let user_id = req.body.user_id;
      user.findOne({ _id: user_id }).then((user_data) => {
        if (user_data) {
          user
            .findByIdAndUpdate(
              { _id: user_id },
              {
                user_name: req.body.user_name.trim().toLowerCase(),
                phone: req.body.phone,
                password: bcrypt.hashSync(req.body.password, salt),
              },
              { new: true }
            )
            .then((new_user) => {
              res
                .status(200)
                .json({ success: true, message: "Successfully Updated User", data: new_user });
            });
        } else {
          res.status(404).json({ success: false, message: "User Not Found" });
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  export const delete_user = async (req, res) => {
    try {
      let user_id = req.body.user_id;
      user.findOne({ _id: user_id }).then((user_data) => {
        if (user_data) {
          user.findByIdAndDelete({_id:user_id}).then(() => {
            res.status(200).json({ success: true, message: "Successfully Deleted User" });
          });
        } else {
          res.status(404).json({ success: false, message: "User Not Found" });
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

export const get_user_by_id=async(req, res)=>{
    try{
    let user_id=req.body.user_id
    user.findOne({_id:user_id}).select({user_name:1, phone:1}).then((user_data)=>{
    if(user_data){
    res.status(200).json({success:true, message:"Success", data:user_data})
    }
    }, (error)=>{
        res.status(404).json({success:false, message:'User Not Found'})
    })
    }catch(error){res.status(500).json({success:false, message:error.message})}
}

export const get_all_users= async(req, res)=>{
    try{
     user.find({}).then((users_data)=>{
      if(users_data){
        res.status(200).json({success:true, message:'success', data:users_data})
      }
     }, (error)=>{
        res.status(404).json({success:false, message:error.message})
     })
    }catch(error){res.status(500).json({success:false, message:error.message}) }
}

export const get_users_report=async(req, res)=>{
    try{
     let start_date=req.body.start_date
     let end_date=req.body.end_date
     let phone=req.body.phone
     if(start_date=='' || start_date==null || start_date ==undefined){
        start_date=new Date()
     }
     else{
        start_date=new Date(start_date)
     }
     if(end_date=='' || end_date==null || end_date ==undefined){
        end_date=new Date()
     }
     else{
        end_date=new Date(end_date)
     }
     let filter={
        $match:{
            createdAt:{
                $gte:start_date,
                $lte:end_date
            }
        }
     } 
     let sort={
        $sort:{
            createdAt:-1
        }
     }
     let phone_filter={
        $match:{
            phone:phone
        }
     }
     user.aggregate([filter, phone_filter, sort]).then((users)=>{
      if(users){
        res.status(200).json({success:true, message:'Success', data:users})
      }
     }, (error)=>{
        res.status(404).json({success:false, message:'No Users Found'})
     })
    }catch(error){res.status(500).json({success:false, message:error.message})}
}


export const login_user = async (req, res) => {
  try {
    let { user_name, password } = req.body;
    if (!user_name || !password) {
      return res.status(200).json({ success: false, message: 'Please fill all fields' });
    }
    
    let _user = await user.findOne({ user_name });

    if (!_user) {
      return res.status(404).json({ success: false, message: 'User Not Found' });
    }

    const isCorrect = await bcrypt.compareSync(password, _user.password);
    if (!isCorrect) {
      return res.status(404).json({ message: "Invalid Password", success: false });
    }

    res.status(200).json({ success: true, message: "Successfully Logged", data:_user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const get_user_history_by_id=async(req, res)=>{
  try{
   let user_id=req.params.user_id
   let match={
    $match:{'user_id':{
      $eq:new mongoose.Types.ObjectId(user_id)
    }}
   }
  let sort={
    $sort:{
      createdAt:-1
    }
  }
  let user_lookup={
    $lookup:{
      from:'users',
      localField:'user_id',
      foreignField:'_id',
      as:'user'
    }
  }
  let unwind_user={
    $unwind:'$user'
  }
  let doctor_lookup={
    $lookup:{
      from:'doctors',
      localField:'doctor_id',
      foreignField:'_id',
      as:'doctor'
    }
  }
  let unwind_doctor={
    $unwind:'$doctor'
  }
  const department_lookup = {
    $lookup: {
      from: "departments",
      localField: "doctor.department_Id",
      foreignField: "_id",
      as: "department",
    },
  };
  const unwind_department = {
    $unwind: "$department",
  };
  const hospital_lookup = {
    $lookup: {
      from: "hospitals",
      localField: "doctor.hospital_Id",
      foreignField: "_id",
      as: "hospital",
    },
  };
  const unwind_hospital = {
    $unwind: "$hospital",
  };
  
  let project={
    $project:{
      _id:1,
      patient_name:1,
      sex:1,
      age:1,
      address:1,
      responsive_person:1,
      responsive_person_phone:1,
      appointment:1,
      doctor_id:1,
      appointment_fee: 1,
      hospital_id:1,
      user_id:1,
      status: 1,
      createdAt:1,
      user_name:'$user.user_name',
      user_phone:'$user.phone',
      doctor_name:'$doctor.doctorName',
      department_name: '$department.deptName',
      hospital_name: '$hospital.hospitalName',
    }
  }
   await appointment.aggregate([match, user_lookup, unwind_user,doctor_lookup,
    unwind_doctor,department_lookup,unwind_department,hospital_lookup,unwind_hospital,project,sort]).then((appointments)=>{
    if(appointments){
      res.status(200).json({success:true, message:'Success', data:appointments})
    }
    else{
      res.status(200).json({success:false, message:'No Appointments Found'})
    }
   },(error)=>{
    res.status(200).json({success:false, message:error.message})
   })
  }catch(error){
    res.status(500).json({success:false, message:error.message})
  }
}

export const reset_user_password=async(req, res)=>{
  try{
   let {user_name, password, confirm_password}=req.body
    if(!user_name || !password || !confirm_password){
      res.status(500).json({success:false, message:'Please Fill All Fields'})
    }else{
   await user.findOne({user_name}).then((user_data)=>{
    if(!user_data){
      res.status(404).json({success:false, message:'Invalid Username!'})
    }else{
   if(password != confirm_password){
    res.status(500).json({success:false, message:'New Password and Confirm Must Match!'})
   }else{
      let new_password= bcrypt.hashSync(req.body.password, salt)
    user.findByIdAndUpdate({_id:user_data._id}, {password:new_password}, {new:true}).then((updated_user)=>{
      if(updated_user){
       res.status(200).json({success:true, message:' Successfully Reset Password'})
      }else{
        res.status(404).json({success:false, message:'User Not Updated'})
      }
    },(error)=>{
      res.status(500).json({success:false, message:error.message})
    })
   }
    }
   })}
  }catch(error){
    res.status(500).json({success:false, message:error.message})
  }
}