import { admin } from "../Models/admin.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import Hospitals from "../Models/hosbitals.js";
const salt =await bcrypt.genSaltSync(10);
export const save_admin=async(req, res)=>{
    try {
        new admin({
            full_name: req.body.full_name.trim().toLowerCase(),
            user_name: req.body.user_name.trim().toLowerCase(),
            email: req.body.email.trim().toLowerCase(),
            phone:req.body.phone,
            password: bcrypt.hashSync(req.body.password, salt),
            admin_type:req.body.admin_type,
            status:req.body.status,
            hospital_id:req.body.hospital_id,
            created_by:req.body.created_by,
            is_hospital_super_admin:req.body.is_hospital_super_admin
        }).save();
        res.status(200).json({message:'Created Success Fully', success:true})
    } catch (error) {
    res.status(500).json({message:error.message,success:false})
   }
}

export const get_all_admins=async(req, res)=>{
try{
  const data=await admin.find({})
  res.status(200).json({success:true, message:'Success', data:data})
}catch(error){
    res.status(500).json({success:false, message:error.message})
}
}

export const get_admin_by_id=async(req, res)=>{
    try{
   let admin_id=req.body.admin_id
   admin.findOne({_id:admin_id}).then((admin_data)=>{
    if(admin_data){
     res.status(200).json({success:true, message:'success', data:data})
    }else{
      res.status(200).status({success:false, message:'Admin Not Found'})
    }
   }, (error)=>{
    res.status(500).status({success:false, message:error.message})

   })
    }catch(error){
        res.status(500).status({success:false, message:error.message})
    }
}

export const delete_admin=async(req, res)=>{
    try{
        let admin_id=req.body.admin_id
        admin.findByIdAndDelete({_id:admin_id}).then((admin_data)=>{
            if(admin_data){
                res.status(200).json({success:true, message:"Admin Deleted Successfully"})
            }
        }, (error=>{
            res.status(404).json({success:false, message:"Admin Not Found"})
        }))
    }catch(error){res.status(500).json({success:false, message:error.message})}
}

export const update_admin=async(req, res)=>{
    try{
     let admin_id =req.body.admin_id
     admin.findByIdAndUpdate({_id:admin_id}, req.body, {new:true})
    }catch(error){res.status(500).json({success:false})}
}

export const reset_password = async (req, res) => {
  try {
    const email = req.body.email;
    const new_password = req.body.new_password;
    const confirm_password = req.body.confirm_password;
    if (new_password !== confirm_password) {
      return res
        .status(200)
        .json({
          exits: true,
          success: false,
          message: "New Password And Confirm Password must be same",
        });
    } else {
      const hashedPassword = bcrypt.hashSync(new_password, salt);
      const admin_data = await admin.findOneAndUpdate(
        { email: email },
        { password: hashedPassword },
        { new: true }
      );
      if (admin_data) {
        res
          .status(200)
          .json({
            exits: true,
            success: true,
            message: "Password reset successfully",
          });
      } else {
        res.status(200).json({ success: false, message: "Admin Not Found" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

  export const change_password = async (req, res) => {
    try {
      const admin_id = req.body.admin_id;
      let old_password = req.body.old_password;
      const new_password = req.body.new_password;
      const confirm_password = req.body.confirm_password;
      const admin_data = await admin.findOne({ _id: admin_id });
      if (!admin_data) {
        return res.status(200).json({ success: false, message: 'Admin not found' });
      }
     old_password=bcrypt.hashSync(old_password, salt)
      if (old_password!==admin_data.password) {
        return res.status(200).json({ success: false, message: 'Invalid old password' });
      }
  
      if (new_password !== confirm_password) {
        return res.status(200).json({ success: false, message: 'New Password And Confirm Password must be same' });
      }
  
      const hashedPassword = bcrypt.hashSync(new_password, salt);
      await admin.findByIdAndUpdate({ _id: admin_data._id }, { password: hashedPassword }, { new: true });
  
      return res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };


  // export const changePassword = async (req, res) => {
  //   try {
  //     const { confirm_password, new_password, old_password, admin_id } = req.body;
  
  //     const user = await admin.findById(admin_id);
  //     if (!user) {
  //       return res.status(400).json({ success: false, message: "Admin not found" });
  //     }
  
  //     const isPasswordValid = bcrypt.compareSync(old_password, user.password);
  //     if (!isPasswordValid) {
  //       return res.status(400).json({ success: false, message: "Invalid old password" });
  //     }
  
  //     if (new_password !== confirm_password) {
  //       return res.status(400).json({ success: false, message: "New password and confirm password do not match" });
  //     }
  
  //     user.password = new_password;
  //     await user.save();
  
  //     res.status(200).json({ success: true, message: "Password updated successfully" });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ success: false, message: "An error occurred while changing password" });
  //   }
  // };


  export const changePassword = async (req, res) => {
    try {
      const { confirm_password, new_password, old_password, admin_id } = req.body;
  
      const user = await admin.findById(admin_id);
      if (!user) {
        return res.status(200).json({ success: false, message: "Email Does Not Exist" });
      }
  
      const isPasswordValid = bcrypt.compareSync(old_password, user.password);
      if (!isPasswordValid) {
        return res.status(200).json({ success: false, message: "Invalid old password" });
      }
  
      if (new_password !== confirm_password) {
        return res.status(200).json({ success: false, message: "New password and confirm password do not match" });
      }
  
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(new_password, salt);
  
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "An error occurred while changing password" });
    }
  };

  export const get_hospital_admins=async(req, res)=>{
    try{
     let filter={
      $match:{
        'admin_type':{
          $eq:2
        },
        '_id':{
          $eq:new mongoose.Types.ObjectId("64b798e19ffe2a4b5c0576ec")
      },
      }
     }
     const hospital_lookup = {
      $lookup: {
        from: "hospitals",
        localField: "hospital_id",
        foreignField: "_id",
        as: "hospital",
      },
    };
    const unwind_hospital = {
      $unwind: "$hospital",
    };
    let project = {
      $project: {
        _id: 1,
      }
    }

    await admin.aggregate([filter,hospital_lookup,unwind_hospital,project]).then((admins)=>{
      if(admins){
        res.status(200).json({success:true, message:'Success', data:admins})
      }else{
        res.status(200).json({success:false, message:'No Admins found!'})
      }
    },(error)=>{
      res.status(500).json({success:false, message:error.message})
    })
    }catch(error){
      res.status(500).json({success: false, message:error.message})
    }
  }


  export const admin_login=async(req, res)=>{
    try{
      let {user_name , password} = req.body
      if(!user_name || !password){
         return  res.status(200).json({success:false, message:"Please enter username and password"})
     }else{
      user_name=user_name.trim()
      await admin.findOne({user_name}).then((admin_data)=>{
        if(admin_data){
          const isCorrect =  bcrypt.compareSync(password,admin_data.password)
          if(!isCorrect){
              return  res.status(200).json({success:false, message:"Incorrect Password"})
          }else{
            if(admin_data.status==0){
              res.status(400).json({success:false, message:"You aren't currently active, You can't login"})
            }else{
            if(admin_data.admin_type==1){
            admin.findOneAndUpdate({user_name}, {logged_at:new Date()}, {new:true}).then((updated_admin)=>{
              if(updated_admin){
                const token = updated_admin.createJWT()
                res.status(200).json({user:{
                    userId:null,
                    admin_type:updated_admin.admin_type,
                    user_name:updated_admin.user_name,
                    current_user:updated_admin._id,
                    status:updated_admin.status,
                    phone:updated_admin.phone,
                },token , success:true ,message:"Successfully logged"})
              }else{
                res.status(200).json({success:false, message:'Admin Not Found'})
              }
            },(error)=>{
              res.status(500).json({success:false, message:error.message})
            })
            }else{
              if(!admin_data.hospital_id && admin_data.hospital_id==undefined && admin_data.hospital_id==null){
              res.status(200).json({success:false, message:'Invalid Hospital Admin'})
              }else{
                Hospitals.findById({_id:admin_data.hospital_id}).then((hospital)=>{
                  if(hospital){
                    if(!hospital.is_approved){
                      res.status(200).json({success:false, message:'Your Hospital Is Not Approved Ask The Admin To Approve'})
                    }else{
                    admin.findOneAndUpdate({hospital_id:hospital._id},{logged_at:new Date()}, {new:true}).then((updated_admin)=>{
                      if(updated_admin){
                        const token = updated_admin.createJWT()
                        res.status(200).json({user:{
                            userId:updated_admin.hospital_id,
                            admin_type:updated_admin.admin_type,
                            user_name:updated_admin.user_name,
                            current_user:updated_admin._id,
                            status:updated_admin.status,
                            phone:updated_admin.phone,
                        },token , success:true ,message:"Successfully logged"})
                      }else{
                        res.status(200).json({success:false, message:'Admin Not Found'})
                      }
                    },(error)=>{
                      res.status(500).json({success:false, message:error.message})
                    })
                    }
                  }else{
                    res.status(200).json({success:false, message:'No Hospital Found'})
                  }
                },(error)=>{
                  res.status(500).json({success:false, message:error.message})
                })
              }}
              }
          }
        }else{
          res.status(200).json({success:false, message:'Invalid Username'})
        }
      },(error)=>{
        res.status(500).json({success:false, message:error.message})
      })
     }
    }catch(error){
      res.status(500).json({success:false, message:error.message})
    }
  }

  export const get_system_admins=async(req, res)=>{
    try{
    let falter={
      $match:{
        "admin_type":{
          $eq:1
        }
      }
    }
    let project={
    
        $project: {
          password: 0
        }
      
    }
    await admin.aggregate([falter, project]).then((admins)=>{
      if(admins){
    res.status(200).json({success:true, message:"Success", data:admins})
      }else{
        res.status(404).json({success:false, message:'No Admins Found'})
      }
    },(error)=>{
      res.status(500).json({success:false, message:error.message})
    })
    }catch(error){
      res.status(500).json({success:false, message:error.message})
    }
  }
  export const get_hospital_single_admins=async(req, res)=>{
    try{
      let hospital_id=req.params.hospital_id
    let falter={
      $match:{
        "admin_type":{
          $eq:2
        },
        "hospital_id":{
          $eq:new mongoose.Types.ObjectId(hospital_id)
        }
      }
    }
    let project={
      $project: {
        password: 0
      }
  }
    await admin.aggregate([falter, project]).then((admins)=>{
      if(admins){
    res.status(200).json({success:true, message:"Success", data:admins})
      }else{
        res.status(404).json({success:false, message:'No Admins Found'})
      }
    },(error)=>{
      res.status(500).json({success:false, message:error.message})
    })
    }catch(error){
      res.status(500).json({success:false, message:error.message})
    }
  }