import mongoose from "mongoose";
import Doctors from "../Models/doctors.js";
import Hospitals from "../Models/hosbitals.js";
import cloudinary from "../utilities/cloudinary.js";
import Departments from "../Models/departments.js";
import moment from 'moment'
import generated_doctor_appointments from "../Models/generate_doctor_appointments.js";
import appointment from "../Models/appointment.js";
import cron  from 'node-cron'

const createDoctor = async (req, res) => {
  try {
    let { doctorName,
      age,
      sex,
      martialStatus,
      address,
      specialist,
      experience,
      phone,
      image,
      email,
      appointments_interval,
      daily_appointments,
      appointment_fee,
      leave_time,
      entry_time,
      department_Id,
      hospital_Id } = req.body
    const imageRes = await cloudinary.uploader.upload(image, {
      folder: 'Images'
    });
   let new_doctor= await Doctors.create({
      doctorName,
      age,
      experience,
      specialist,
      phone,
      email,
      department_Id,
      hospital_Id,
      appointments_interval,
      daily_appointments,
      leave_time,
      entry_time,
      sex,
      address,
      martialStatus,
      appointment_fee,
      image: {
        public_id: imageRes.public_id,
        url: imageRes.secure_url
      }
    });
   await Hospitals.findByIdAndUpdate({_id:hospital_Id}, {has_doctors:true},{new:true}).then((hospital)=>{
      if(hospital){
         Departments.findByIdAndUpdate({_id:new_doctor.department_Id},{has_doctors:true},{new:true}).then((department)=>{
          if(department){
            res.status(200).json({success: true , message: 'Successfully Created Doctor' })
          }else{
            res.status(200).json({success:false, message:'No Department Found'})
          }
         },(error)=>{
          res.status(500).json({success:false, message:error.message})
         })
      }else{
        res.status(200).json({success:false, message: 'No Hospital Found' })
      }
    },(error)=>{
      res.status(500).json({success:false, message:error.message})
    })
  } catch (error) {
    res.status(500).json({ message: error.message, status: false })
  }
}

const updateDoctor = async (req, res) => {
  try {
    let { doctorName,
      age,
      sex,
      martialStatus,
      address,
      specialist,
      experience,
      phone,
      image,
      email,
      appointments_interval,
      daily_appointments,
      appointment_fee,
      leave_time,
      entry_time,
      department_Id,
       } = req.body
    
    if(req.body.image===null){
      await Doctors.findByIdAndUpdate(req.params.id, {doctorName,
        age,
        sex,
        martialStatus,
        address,
        specialist,
        experience,
        phone,
        email,
        appointments_interval,
        daily_appointments,
        appointment_fee,
        leave_time,
        entry_time,
        department_Id,}, { new: true }).then((doctor)=>{
        if(doctor){
          res.status(200).json({success: true, message: 'Updated Successfully', data: doctor })
        }else{
          res.status(200).json({success: false, message: 'Doctor Not Found' })
        }
      },(error)=>{
        res.status(500).json({success:false, message:error.message})
      })
    }else{
      let imageRes = await cloudinary.uploader.upload(image, {
        folder: 'Images'
      });
        image= {
          public_id: imageRes.public_id,
          url: imageRes.secure_url
        }
        await Doctors.findByIdAndUpdate(req.params.id, {doctorName,
          age,
          sex,
          martialStatus,
          address,
          specialist,
          experience,
          phone,
          email,
          image,
          appointments_interval,
          daily_appointments,
          appointment_fee,
          leave_time,
          entry_time,
          department_Id,}, { new: true }).then((doctor)=>{
          if(doctor){
            res.status(200).json({success: true, message: 'Updated Successfully', data: doctor })
          }else{
            res.status(200).json({success: false, message: 'Doctor Not Found' })
          }
        },(error)=>{
          res.status(500).json({success:false, message:error.message})
        })
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: false })
  }
}

const deleteDoctor = async (req, res) => {
  try {
    const data = await Doctors.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Deleted...', status: true })
  } catch (error) {
    res.status(500).json({ message: error, status: false })
  }
}

const fetchDoctors = async (req, res) => {
  try {
    let doctors = await Doctors.find({}).sort({ createdAt: -1 })
    if (doctors) {
      res.status(200).json({ message: 'success', data: doctors, success: true })
    } else {
      res.status(200).json({ message: 'No Doctors Found', success: false })
    }
  } catch (error) {
    res.status(500).json({ message: error, status: false })
  }
}
export const fetchDoctors_for_app = async (req, res) => {
  try {
    let match = {
      $match: {
        'is_active': {
          $eq: true
        }
      }
    }
    let sort = {
      $sort: {
        createdAt: -1
      }
    }
    await Doctors.aggregate([match, sort]).then((doctors) => {
      if (doctors) {
        res.status(200).json({ message: 'success', data: doctors, success: true })
      } else {
        res.status(200).json({ message: 'No Doctors Found', success: false })
      }
    }, (error) => {
      res.status(200).json({ message: 'No Doctors Found', success: false })
    })
  } catch (error) {
    res.status(500).json({ message: error, status: false })
  }
}
export const get_doctor_report = async (req, res) => {
  try {
    let start_date = req.params.start
    let end_date = req.params.end
    if (start_date === "" || start_date === undefined || start_date === null) {
      start_date = new Date(0)
    }
    else {
      start_date = new Date(start_date)
    }
    if (end_date == "" || end_date == undefined || end_date == null) {
      end_date = new Date()
    }
    else {
      end_date = new Date()
    }
    let filter = {
      $match: {
        createdAt: {
          $gte: start_date,
          $lte: end_date
        }
      }
    }
    let sort = {
      $sort: {
        createdAt: -1
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
    const hospital_lookup = {
      $lookup: {
        from: "hospitals",
        localField: "hospital_Id",
        foreignField: "_id",
        as: "hospital",
      },
    };
    const unwind_department = {
      $unwind: "$department",
    };
    const unwind_hospital = {
      $unwind: "$hospital",
    };
    let project = {
      $project: {
        _id: 1,
        experience: 1,
        specialist: 1,
        address: 1,
        martialStatus: 1,
        age: 1,
        doctorName: 1,
        sex: 1,
        phone: 1,
        email: 1,
        createdAt: 1,
        hospital_name: '$hospital.hospitalName',
        department_name: '$department.deptName',
      }
    }
    Doctors.aggregate([filter, department_lookup, unwind_department, hospital_lookup, unwind_hospital, project, sort]).then((doctor_data) => {
      if (doctor_data.length > 0) {
        res.status(200).json({ data: doctor_data, success: true })
      }
      else {
        res.status(404).json({ data: [], success: false })
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message, success: false })
  }
}
export const get_doctor_by_id = async (req, res) => {
  try {
    let id = req.params.doctor_id
    let data = await Doctors.findById(id)
    res.status(200).json({ data: data, success: true })
  } catch (error) {
    res.status(500).json({ message: error.message, success: false })
  }

}
export const get_doctors_by_department_id = async (req, res) => {
  try {
    let department_id = req.params.department_id
    let match = {
      $match: {
        'department_Id': {
          $eq: new mongoose.Types.ObjectId(department_id)
        },
        'is_active':{
          $eq:true
        }
      }
    }
    await Doctors.aggregate([match]).then((doctors) => {
      if (doctors) {
        res.status(200).json({ success: true, message: 'Success', data: doctors })
      } else {
        res.status(200).json({ success: false, message: 'No Doctors Found' })
      }
    })
  }
  catch (error) {
    res.status(500).json({ message: error.message, success: false })
  }
}
export const get_doctors_by_department_id_for_app = async (req, res) => {
  try {
    let department_id = req.params.department_id
    let match = {
      $match: {
        'department_Id': {
          $eq: new mongoose.Types.ObjectId(department_id)
        },
        'is_active': {
          $eq: true
        }
      }
    }
    await Doctors.aggregate([match]).then((doctors) => {
      if (doctors) {
        res.status(200).json({ success: true, message: 'Success', data: doctors })
      } else {
        res.status(200).json({ success: false, message: 'No Doctors Found' })
      }
    })
  }
  catch (error) {
    res.status(500).json({ message: error.message, success: false })
  }
}

export const get_doctors_by_hospital_id = async (req, res) => {
  try {
    let hospital_id = req.params.id
    let data = await Doctors.find({ hospital_Id: hospital_id }).sort({ createdAt: -1 })
    res.status(200).json({ data: data, success: true })
  } catch (error) {
    res.status(500).json({ message: error.message, success: false })
  }
}
export const get_doctors_report_by_hospital_id = async (req, res) => {
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
    let project = {
      $project: {
        _id: 1,
        experience: 1,
        specialist: 1,
        address: 1,
        martialStatus: 1,
        age: 1,
        doctorName: 1,
        sex: 1,
        createdAt: 1,
        department_name: '$department.deptName'
      }
    }

    const sort = { $sort: { createdAt: -1 } };
    await Hospitals.findOne({ _id: hospital_id }).then((hospital) => {
      var hospital_condition = {
        $match: {
          "hospital_Id": {
            $eq: new mongoose.Types.ObjectId(hospital_id),
          },
        },
      };
      Doctors.aggregate([hospital_condition, filter, department_lookup, unwind_department, project, sort]).then((departments) => {
        if (departments) {
          res.status(200).json({ success: true, data: departments })
        }
      }, (error) => {
        res.status(200).json({ success: false, message: "No Doctors Found" })
      })

    }, (error) => {
      res.status(200).json({ success: false, message: 'Hospital Not Found' })
    })
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const update_doctor_appointments = async (req, res) => {
  try {
    let doctor_id = req.body.doctor_id
    let appointments = req.body.appointments
    await Doctors.findByIdAndUpdate({ _id: doctor_id }, { appointments: appointments }, { new: true }).then((data) => {
      if (data) {
        res.status(200).json({ success: true, message: 'Success', data: data })
      }
    }, (error) => {
      res.status(200).json({ success: false, message: 'Doctor Not Found' })
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const activate_or_deactivate_doctor = async (req, res) => {
  try {
    let { doctor_id, is_active } = req.body;
    await Doctors.findByIdAndUpdate({ _id: doctor_id }, { is_active: is_active }, { new: true }).then((doctor) => {
      if (doctor) {
        res.status(200).json({ success: true, message: "Successfully Updated Doctor", data: doctor })
      } else {
        res.status(200).json({ success: false, message: 'Doctor Not Found' })
      }
    }, (error) => {
      res.status(200).json({ success: false, message: 'Doctor Not Found' })
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
export const generate_doctor_appointments = async (req, res) => {
  try {
    let { doctor_id } = req.body;

    let entryTime = moment(req.body.entry_time, 'HH:mm');
    let leaveTime = moment(req.body.leave_time, 'HH:mm');
    let interval = parseInt(req.body.interval);
    let lastAppointment = moment(leaveTime).subtract(interval, 'minutes').format('HH:mm');
    let newTime = moment(entryTime).add(interval, 'minutes').format('HH:mm');
    const appointments = [];
    let appointmentIndex = 1;

    let appointment_one = {
      index: appointmentIndex,
      title: `Appointment ${appointmentIndex}`,
      status: 0,
      time: req.body.entry_time,
    };
    appointments.push(appointment_one);
    while (newTime !== lastAppointment) {
      appointmentIndex += 1;
      const appointment = {
        index: appointmentIndex,
        title: `Appointment ${appointmentIndex}`,
        time: newTime,
        status: 0,
      };
      appointments.push(appointment);
      newTime = moment(newTime, 'HH:mm').add(interval, 'minutes').format('HH:mm');
    }
    let last_appointment = {
      index: appointmentIndex+1,
      title: `Appointment ${appointmentIndex+1}`,
      status: 0,
      time: lastAppointment,
    };
    appointments.push(last_appointment)
   let generated=await generated_doctor_appointments.create({
      doctor_id,
      appointments
    })
    if(generated){
      await Doctors.findByIdAndUpdate({_id:doctor_id}, {has_appointments:true}, {new:true}).then((updated_doctor)=>{
        if(updated_doctor){
          res.status(200).json({ success: true, message:'Success', data: generated });
        }else{
     res.status(200).json({success:false, message:'Doctor Not Found'})
        }
      })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const get_doctor_appointments = async (req, res) => {
  try {
    const doctor_id = req.params.doctor_id;
    await generated_doctor_appointments.findOne({ doctor_id }).then((appointments) => {
      if (appointments) {
        let _id=appointments._id
        let doctor_id=appointments.doctor_id
        const available_appointments = appointments.appointments.filter((appointment) => appointment.status === 0);
        let data={
          _id,
          doctor_id,
          appointments:available_appointments
        }
        res.status(200).json({ success: true, message: "Success", data: data });
      } else {
        res.status(404).json({ success: false, message: "No Appointments Found" });
      }
    }, (error) => {
      res.status(500).json({ success: false, message: error.message });
    });
    //const currentTime = moment(new Date).format('HH:mm');
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export { createDoctor, updateDoctor, deleteDoctor, fetchDoctors }