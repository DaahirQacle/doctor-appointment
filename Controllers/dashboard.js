import mongoose from "mongoose";
import { admin } from "../Models/admin.js";
import appointment from "../Models/appointment.js";
import Departments from "../Models/departments.js";
import Doctors from "../Models/doctors.js";
import emergency from "../Models/emergency.js";
import Hospitals from "../Models/hosbitals.js"

export const get_admin_dashboard=async(req, res)=>{
    try{
     await Hospitals.find({}).then((hospitals)=>{
        let num_hospitals;
        if(hospitals){
            num_hospitals=hospitals.length
        }else{
            num_hospitals=0;
        }
         Departments.find({}).then((departments)=>{
            let num_departments;
            if(departments){
               num_departments= departments.length
            }
            else{
                num_departments=0
            }
            Doctors.find({}).then((doctors)=>{
                let num_doctors;
                if(doctors){
                    num_doctors=doctors.length
                }
                else{
                    num_doctors=0;
                }
               emergency.find({}).then((emergencies)=>{
                let num_emergency
                if(emergencies){
                    num_emergency=emergencies.length
                }
                else{
                    num_emergency=0;
                }
                admin.find({}).then((admin_data)=>{
                    let num_admins;
                    if(admin_data){
                        num_admins=admin_data.length
                    }else{
                        num_admins=0
                    }
                    appointment.find({}).then((appointments)=>{
                        let num_appointments
                        if(appointments){
                            num_appointments=appointments.length
                        }else{
                            num_appointments=0
                        }
                        res.status(200).json({hospitals:num_hospitals, departments:num_departments,
                        doctors:num_doctors, admins:num_admins, emergencies:num_emergency, appointments:num_appointments})
                    })
                })
               })
            })
         })
     })
    }catch(error){
        res.status(500).json({success:false, message:error.message})
    }
}

export const get_hospital_dashboard=async(req, res)=>{
    try{
    let hospital_id=req.params.hospital_id
    
   await Hospitals.find({_id:hospital_id}).then((hospital_data)=>{
    if(hospital_data){
    Departments.find({hospital_Id:hospital_id}).then((departments)=>{
        let num_departments
        if(departments){
         num_departments=departments.length

        }else{
      num_departments=0;
        }
        Doctors.find({hospital_Id:hospital_id}).then((doctors)=>{
            let num_doctors
            if(doctors){
           num_doctors=doctors.length
            }
            else{
                num_doctors=0;
            }
            emergency.find({hospital_id:hospital_id}).then((emergencies)=>{
                let num_emergency
                if(emergencies){
                    num_emergency=emergencies.length
                }else{
                    num_emergency=0
                }
                admin.find({hospital_id}).then((admins)=>{
                    let num_admins
                    if(admins){
                    num_admins=admins.length
                    }else{
                        num_admins=0
                    }
                    const doctor_lookup = {
                        $lookup: {
                        from: "doctors",
                        localField: "doctor_id",
                        foreignField: "_id",
                        as: "doctor",
                      },
                    };
                    const unwind_doctor = {
                      $unwind: "$doctor",
                    };
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
                    let project = {
                        $project: {
                          _id: 1,
                        }
                    }
                    var match = {
                        $match: {
                          "hospital_id": {
                            $eq: new mongoose.Types.ObjectId(hospital_id),
                          },
                        },
                      };
                    appointment.aggregate([match, hospital_lookup, unwind_hospital, doctor_lookup, unwind_doctor, department_lookup, unwind_department, project]).then((appointments) => {
                        let num_appointments
                        if (appointments) {
                            num_appointments=appointments.length
                        }else{
                            num_appointments=0;
                        }
            res.status(200).json({success:true, message:'Success', departments:num_departments, doctors:num_doctors, emergencies:num_emergency, admins:num_admins, appointments:num_appointments})
                    })
                },(error)=>{
                    res.status(200).json({success:false, message:error.message})
                })
            },(error)=>{
                res.status(200).json({success:false, message:error.message})
            })
        },(error)=>{
            res.status(200).json({success:false, message:error.message})
        })
    },(error)=>{
        res.status(200).json({success:false, message:error.message})
    })
    }else{
        res.status(200).json({success:false, message:'Hospital Not Found'})
    }
   },(error)=>{
    res.status(200).json({success:false, message:error.message})
   })
    }catch(error){
        res.status(500).json({success:false, message:error.message})
    }
}
export const get_login_summary=async(req, res)=>{
    try{
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
        let project={
            $project:{
                _id:1,
                hospital_id:1,
                hospital_name: '$hospital.hospitalName',
                address:1,
                user_name:1,
                telephone:'$hospital.telephone',
                phone:1,
                email:-1,
                logged_at:1,
            }
        }
        let limit={
            $limit:10,
        }
        let sort={
            $sort:{
                logged_at:-1
            }
        }
        let filter={
            $match:{
                'admin_type':{
                     $eq:2
                },
                'hospital_id': {
                    $ne: null
                  }
            }
        }
    await admin.aggregate([filter,hospital_lookup,unwind_hospital ,project,sort,limit]).then((hospitals)=>{
        if(hospitals){
            res.status(200).json({success:true, message:"Success", data:hospitals})
        }else{
            res.status(200).json({success:false, message:'No Hospitals Found'})
        }
    },(error)=>{
        res.status(500).json({success:false, message:error.message})
    },(error)=>{
        res.status(500).json({success:false, message:error.message})
    })
    }catch(error){
res.status(500).json({success:false, message:error.message})
    }
}


export const get_hospitals_summary = async (req, res) => {
  try {
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
      let project={
        $project: {
          name: 1,
          hospitalName:1,
          address:1,
          phone:1,
          managerName:1,
          telephone:1,
          emergency:1,
          departmentCount: { $size: '$departments' },
          doctorCount: { $size: '$doctors' },
        },
      }
 await Hospitals.aggregate([
      department_lookup, doctor_lookup,project
    ]).then((hospitals)=>{
    if(hospitals){
        res.status(200).json({success:true, message:'Success', data:hospitals})
    }else{
        res.status(200).json({success:false, message:'No Hospitals Found',})
    }
    },(error)=>{
        res.status(500).json({success:false, message:error.message})
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const get_departments_summary_by_hospital_id=async(req, res)=>{
    try{
  let hospital_id=req.params.id
  let match = {
    $match: {
      'hospital_Id': {
        $eq: new mongoose.Types.ObjectId(hospital_id)
      }
    }
  }
  const doctor_lookup = {
    $lookup: {
      from: "doctors",
      foreignField: "department_Id",
      localField: "_id",
      as: "doctor",
    },
  };
  let project={
    $project:{
        _id:1,
        deptName:1,
       num_of_doctors: { $size: '$doctor' },
    }
  }

  await Departments.aggregate([match,doctor_lookup, project ]).then((departments)=>{
    if(departments){
   res.status(200).json({success:true, message:'Success', data:departments})
    }else{
        res.status(200).json({success:false, message:'No Departments Found'})
    }
  },(error)=>{
    req.status(500).json({success:false, message:error.message})
  })
    }
    catch(error){
        res.status(500).json({success:false, message:error.message})
    }
}

export const get_active_doctors_by_hospital_id=async(req, res)=>{
    try{
   let hospital_id=req.params.id
   let match = {
    $match: {
      'hospital_Id': {
        $eq: new mongoose.Types.ObjectId(hospital_id)
      },
      'is_active':{
        $eq:true
      }
    }
}
const department_lookup = {
    $lookup: {
      from: "departments",
      localField: "department_Id",
      foreignField: "_id",
      as: "department",
    },
  };
const unwind_department = {
    $unwind: "$department",
  };
let sort={
    $sort:{updatedAt:-1}
}
let project={
    $project:{
        _id:1,
        doctorName:1,
        phone:1,
        email:1,
        address:1,
        updatedAt:1,
        is_active:1,
        department_name:'$department.deptName'
    }
}
await Doctors.aggregate([match,department_lookup,unwind_department,project ,sort]).then((doctors)=>{
    if(doctors){
        res.status(200).json({success:true, message:'Success', data:doctors})
    }else{
        res.status(200).json({success:false, message:'No Doctors Found'})
    }
},(error)=>{
    res.status(500).json({success:false, message:error.message})
})
    }catch(error){
        res.status(500).json({success:false, message:error.message})
    }
}