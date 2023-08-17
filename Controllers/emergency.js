import mongoose from "mongoose"
import emergency from "../Models/emergency.js"
import Hospitals from "../Models/hosbitals.js"
import cron  from 'node-cron'
import { send_sms } from "../utilities/gateways.js"

export const create_emergency=async(req, res)=>{
    try{
    let hospital_id=req.body.hospital_id
    let _need_ambulance= req.body.need_ambulance=='Yes'? true : false
    let filter={
        $match:{
            'hospital_id':{$eq:new mongoose.Types.ObjectId(hospital_id)},
           'status': {$eq:1}
        },
    }
    await Hospitals.findOne({_id:hospital_id}).then((hospital_data)=>{
        if(hospital_data){
        emergency.aggregate([filter]).then((emergencies)=>{
            if(emergencies){
        let count=emergencies.length
        if(count + 1==hospital_data.emergency_capacity){
         Hospitals.findOneAndUpdate({_id:hospital_id},{emergency:false}, {new:true}).then((hsopital)=>{
            if(hsopital){
             emergency.create({
              patient_name:req.body.patient_name,
              phone:Number(req.body.phone),
              address:req.body.address,
              need_ambulance:_need_ambulance,
              hospital_id:req.body.hospital_id
            })
            let phone=Number(req.body.phone)
            let patient_name=req.body.patient_name
            let content =`Dear, ${patient_name} waad ku mahadsantahay inaad soo dalbato adeeg degdeg ah`
            send_sms(content, phone)
            res.status(200).json({success:true, message:'Successfully Created Emergency'})
            }else{
                res.status(200).json({success:false,message:'Hospital Emergency Not Closed'})
            }
         },(error)=>{
            res.status(500).json({success:false, message:error.message})
         })
        }else{
             emergency.create({
              patient_name:req.body.patient_name,
              phone:Number(req.body.phone),
              address:req.body.address,
              need_ambulance:_need_ambulance,
              hospital_id:req.body.hospital_id
            })
            res.status(200).json({success:true, message:'Successfully Created Emergency'})
        }
            }else{
                res.status(200).json({success:false, message:'No Emergency Found'})
            }
        },(error)=>{
            res.status(500).json({success:false, message:error.message})
        })
        }else{
            res.status(200).json({success:false, message:'No Hospital Found'})
        }
    },(error)=>{
    res.status(500).json({success:false, message:error.message})
    })
    const task = cron.schedule('*/5 * * * *', async () => {
        try {
            await emergency.updateMany(
                { status: { $eq: 1 } },
                { status: 3 }
              );
              task.destroy();   
        }
          //task.destroy(); 
        catch(error){
        res.status(500).json({success:false, message:error.message})
        }
    }
    )
    }catch(error){
        res.status(500).json({success:false, message:error.message})
    }
}

export const get_emergency_by_hospital_id=async(req,res)=>{
    try{
        let start_date = new Date();
      start_date.setHours(0, 0, 0, 0);
      let end_date = new Date();
      end_date.setHours(23, 59, 59, 999); 
    let hospital_id=req.params.hospital_id
    let match={
        $match:{
            createdAt:{
                $gte:start_date,
                $lte:end_date
            },
            'hospital_id':{
                $eq:new mongoose.Types.ObjectId(hospital_id)
            }
        }
    }
    await emergency.aggregate([match]).sort({createdAt:-1}).then((hospital)=>{
        if(hospital){
        res.status(200).json({success:true, message:"Successfully Updated Emergency", data:hospital})
        }
        else{
            res.status(200).json({success:false, message:"No Emergency Found"})
        }
    }, (error)=>{
        res.status(200).json({success:false, message:"No Emergency Found"})
    })
    }catch(error){
        res.status(500).json({success:false, message:error.message})
    }
}
export const get_emergency_reports_by_hospital_id=async(req,res)=>{
    try{
    let hospital_id=req.params.hospital_id;
    let start_date = req.params.start;
    let end_date = req.params.end;
    
        if (!start_date) {
          start_date = new Date();
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
    let match={
        $match:{
            createdAt:{
                $gte:start_date,
                $lte:end_date
            },
            'hospital_id':{
                $eq:new mongoose.Types.ObjectId(hospital_id)
            }
        }
    }
    await emergency.aggregate([match]).sort({createdAt:-1}).then((hospital)=>{
        if(hospital){
        res.status(200).json({success:true, message:"Successfully Updated Emergency", data:hospital})
        }
        else{
            res.status(200).json({success:false, message:"No Emergency Found"})
        }
    }, (error)=>{
        res.status(200).json({success:false, message:"No Emergency Found"})
    })
    }catch(error){
        res.status(500).json({success:false, message:error.message})
    }
}

export const get_all_emergencies=async(req, res)=>{
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
    
        let sort = { $sort: { createdAt: -1 } };
        let project={
            $project:{
                _id:1,
                patient_name:1,
                phone:1,
                address:1,
                need_ambulance:1,
                status:1,
                createdAt:1,
                hospital_name: '$hospital.hospitalName',
                hospital_id: '$hospital._id',
                createdAt:1,
            }
        } 
    let start_date = new Date();
      start_date.setHours(0, 0, 0, 0);
      let end_date = new Date();
      end_date.setHours(23, 59, 59, 999); 
      let status=Number(req.params.status)
        let filter={
            $match:{
                createdAt:{
                    $gte:start_date,
                    $lte:end_date
                }
            }
        }
        if (status) {
            filter.$match.status = status;
          }
   await emergency.aggregate([filter,hospital_lookup, unwind_hospital, project, sort]).then((emergencies)=>{
    if(emergencies){
   res.status(200).json({success:true, message:"Success", data:emergencies})
    }else{
        res.status(200).json({success:false, message:error.message})
    }
   })
    }catch(error){
        res.status(500).json({success:false, message:error.message})
    }
}
export const get_all_emergencies_report=async(req, res)=>{
    try{
        let start_date = req.params.start;
        let end_date = req.params.end;
    
        if (!start_date) {
          start_date = new Date();
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
    
        let sort = { $sort: { createdAt: -1 } };
        let project={
            $project:{
                _id:1,
                patient_name:1,
                phone:1,
                address:1,
                need_ambulance:1,
                status:1,
                createdAt:1,
                hospital_name: '$hospital.hospitalName',
                hospital_id: '$hospital._id',
                createdAt:1
            }
        } 
    
        let filter={
            $match:{
                createdAt:{
                    $gte:start_date,
                    $lte:end_date
                }
            }
        }
   await emergency.aggregate([filter,hospital_lookup, unwind_hospital, project, sort]).then((emergencies)=>{
    if(emergencies){
   res.status(200).json({success:true, message:"Success", data:emergencies})
    }else{
        res.status(200).json({success:false, message:error.message})
    }
   })
    }catch(error){
        res.status(500).json({success:false, message:error.message})
    }
}
export const get_emergency_by_hospital_id_and_status=async(req, res)=>{
    try{
        let hospital_id=req.params.hospital_id
        let status=Number(req.params.status)
        let start_date = new Date();
      start_date.setHours(0, 0, 0, 0);
      let end_date = new Date();
      end_date.setHours(23, 59, 59, 999); 

        var match = {
            $match: {
              "hospital_id": {
                $eq:new mongoose.Types.ObjectId(hospital_id),
              },
              createdAt:{
                $gte:start_date,
                $lte:end_date
              }
            },
          };
          if (status) {
            match.$match.status = status;
          }
        
    await emergency.aggregate([match]).then((emergencies)=>{
        if(emergencies){
            res.status(200).json({success:true, message:"Success.....", data:emergencies})
        }
        else{
            res.status(200).json({success:false, message:'No Emergency Found'})
        }
    },(error)=>{
        res.status(500).json({success:false, message:error.message})
    })
    }catch(error){
        res.status(500).json({success:false, message:error.message})
    }
}

export const update_emergency_status=async(req, res) =>{
    try{
    let emergency_id=req.params.emergency_id
    let status=Number(req.body.status)
    await emergency.findOneAndUpdate({_id:emergency_id}, {status}, {new:true}).then((emergency)=>{
        if(emergency){
       res.status(200).json({success:true, message:"Success", data:emergency})
        }else{
        res.status(200).json({success:false, message:'Emergency Not Found'})
        }
    },(error)=>{
        res.status(200).json({success:false, message:error.message})
    })
    }catch(error){
        res.status(500).json({success:false, message:error.message})
    }
}