import mongoose from "mongoose";
import appointment from "../Models/appointment.js"
import Departments from "../Models/departments.js";
import Doctors from "../Models/doctors.js";


export const create_appointment = async (req, res) => {
  try {
    const new_appointment = await appointment.create({
      patient_name: req.body.patient_name.trim().toLowerCase(),
      sex: req.body.sex,
      age: req.body.age,
      address: req.body.address,
      responsive_person: req.body.responsive_person.trim().toLowerCase(),
      responsive_person_phone: req.body.responsive_person_phone,
      appointment_time: req.body.appointment_time,
      appointment_fee: req.body.appointment_fee,
      doctor_id: req.body.doctor_id,
      hospital_id: req.body.hospital_id,
      user_id: req.body.user_id,
    });
    res.status(200).json({
      success: true,
      message: "Successfully Created Appointment",
      data: new_appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const update_appointment_status = async (req, res) => {
  try {
    let appointment_id = req.params.appointment_id;
    let status = Number(req.body.status);
    let cancel_reason=req.body.cancel_reason

    await appointment.findByIdAndUpdate(
      { _id: appointment_id,},
      { status, cancel_reason },
      { new: true }
    ).then((new_appointment) => {
      res.status(200).json({ success: true, message: "Successfully Updated Appointment", data: new_appointment });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const get_all_appointments__ = async (req, res) => {
  try {
    let status = Number(req.body.status)
    let match = {}
    if (status) {
      match.match.status = status
    }
    let appointments = await appointment.find()
    res.status(200).json({ success: true, message: 'Success', data: appointments })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
export const get_all_appointments = async (req, res) => {
  try {
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

    let sort = { $sort: { createdAt: -1 } };
    let project = {
      $project: {
        _id: 1,
        patient_name: 1,
        responsive_person_phone: 1,
        responsive_person: 1,
        address: 1,
        need_ambulance: 1,
        status: 1,
        appointment_fee: 1,
        appointment_time: 1,
        sex: 1,
        age: 1,
        createdAt: 1,
        hospital_name: '$hospital.hospitalName',
        hospital_id: '$hospital._id',
        doctor_name: '$doctor.doctorName',
        department_name: '$department.deptName',
        doctor_id: '$doctor._id',
        cancel_reason:1,
        updatedAt:1,
        createdAt:1
      }
    }
    let start_date = new Date(0);
    start_date.setHours(0, 0, 0, 0);
    let end_date = new Date();
    end_date.setHours(23, 59, 59, 999);
    let status = Number(req.params.status)
    let filter = {
      $match: {
        createdAt: {
          $gte: start_date,
          $lte: end_date
        }
      }
    }
    if (status) {
      filter.$match.status = status;
    }
    await appointment.aggregate([filter, doctor_lookup, unwind_doctor, hospital_lookup, unwind_hospital, department_lookup, unwind_department, project, sort]).then((appointments) => {
      if (appointments) {
        res.status(200).json({ success: true, message: "Success", data: appointments })
      } else {
        res.status(200).json({ success: false, message: error.message })
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
export const get_appointment_by_user_id = (req, res) => {
  try {
    let user_id = req.body.user_id
    appointment.findOne({ user_id: user_id }).then((appointment_data) => {
      if (appointment_data) {
        res.status(200).json({ success: true, message: 'Success', data: appointment_data })
      }
    }, (error) => {
      res.status(404).json({ success: false, message: 'Appointment Not Found' })
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const get_appointments_report_ = async (req, res) => {
  try {
    let start_date = req.body.start_date
    let end_date = req.body.end_date
    if (start_date == null || start_date == undefined || start_date == "") {
      start_date = new Date()
    }
    else {
      start_date = new Date(start_date)
    }
    if (end_date == null || end_date == undefined || end_date == "") {
      end_date = new Date()
    }
    else {
      end_date = new Date(end_date)
    }

    let filter = {
      $match: {
        createdAt: {
          $gte: start_date,
          $lte: end_date
        }
      }
    }
    console.log(filter, 'filter')
    let sort = {
      $sort: {
        createdAt: -1
      }
    }
    appointment.aggregate([filter, sort]).then((appointments) => {
      if (appointments) {
        console.log(appointments, 'appointments')
        res.status(200).json({ success: true, message: 'Success', data: appointments })
      }
    }, (error) => {
      res.status(404).json({ success: false, message: 'No Appointments Found' })
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const get_appointments_by_hospital_id_and_status = async (req, res) => {
  try {
    let hospital_id = req.params.hospital_id
    let status = Number(req.params.status)
    let start_date = new Date(0);
    start_date.setHours(0, 0, 0, 0);
    let end_date = new Date();
    end_date.setHours(23, 59, 59, 999);
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

    let sort = { $sort: { createdAt: -1 } };
    let project = {
      $project: {
        _id: 1,
        patient_name: 1,
        responsive_person_phone: 1,
        responsive_person: 1,
        address: 1,
        need_ambulance: 1,
        appointment_fee: 1,
        appointment_time: 1,
        status: 1,
        sex: 1,
        age: 1,
        createdAt: 1,
        hospital_name: '$hospital.hospitalName',
        hospital_id: '$hospital._id',
        doctor_name: '$doctor.doctorName',
        department_name: '$department.deptName',
        doctor_id: '$doctor._id',
        department_id: '$department._id',
        cancel_reason:1,
        updatedAt:1,
        createdAt:1
      }
    }
    var match = {
      $match: {
        "hospital_id": {
          $eq: new mongoose.Types.ObjectId(hospital_id),
        },
        createdAt: {
          $gte: start_date,
          $lte: end_date
        }
      },
    };
    if (status) {
      match.$match.status = status;
    }
    await appointment.aggregate([match, hospital_lookup, unwind_hospital, doctor_lookup, unwind_doctor, department_lookup, unwind_department, project, sort]).then((appointments) => {
      if (appointments) {
        res.status(200).json({ success: true, message: 'Success', data: appointments })
      } else {
        res.status(200).json({ success: false, message: 'No Data Found' })
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const get_appointments_report_by_hospital_id = async (req, res) => {
  try {
    let hospital_id = req.params.hospital_id
    let start_date = req.params.start_date;
    let end_date = req.params.end_date;
    if (!start_date) {
      start_date = new Date(0)
    }
    else {
      start_date = new Date(start_date)
    }
    if (!end_date) {
      end_date = new Date()
    }
    else {
      end_date = new Date(end_date)
    }
    start_date.setHours(0, 0, 0, 0);
    end_date.setHours(23, 59, 59, 999);
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

    let sort = { $sort: { createdAt: -1 } };
    let project = {
      $project: {
        _id: 1,
        patient_name: 1,
        responsive_person_phone: 1,
        responsive_person: 1,
        address: 1,
        need_ambulance: 1,
        status: 1,
        sex: 1,
        age: 1,
        createdAt: 1,
        hospital_name: '$hospital.hospitalName',
        hospital_id: '$hospital._id',
        doctor_name: '$doctor.doctorName',
        department_name: '$department.deptName',
        doctor_id: '$doctor._id',
        department_id: '$department._id'
      }
    }
    var match = {
      $match: {
        "hospital_id": {
          $eq: new mongoose.Types.ObjectId(hospital_id),
        },
        createdAt: {
          $gte: start_date,
          $lte: end_date
        }
      },
    };
    await appointment.aggregate([match, hospital_lookup, unwind_hospital, doctor_lookup, unwind_doctor, department_lookup, unwind_department, project, sort]).then((appointments) => {
      if (appointments) {
        res.status(200).json({ success: true, message: 'Success', data: appointments })
      } else {
        res.status(200).json({ success: false, message: 'No Data Found' })
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
export const get_appointments_report = async (req, res) => {
  try {
    let start_date = req.params.start_date;
    let end_date = req.params.end_date;
    if (!start_date) {
      start_date = new Date(0)
    }
    else {
      start_date = new Date(start_date)
    }
    if (!end_date) {
      end_date = new Date()
    }
    else {
      end_date = new Date(end_date)
    }
    start_date.setHours(0, 0, 0, 0);
    end_date.setHours(23, 59, 59, 999);
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

    let sort = { $sort: { createdAt: -1 } };
    let project = {
      $project: {
        _id: 1,
        patient_name: 1,
        responsive_person_phone: 1,
        responsive_person: 1,
        address: 1,
        need_ambulance: 1,
        status: 1,
        sex: 1,
        age: 1,
        createdAt: 1,
        hospital_name: '$hospital.hospitalName',
        hospital_id: '$hospital._id',
        doctor_name: '$doctor.doctorName',
        department_name: '$department.deptName',
        doctor_id: '$doctor._id',
        department_id: '$department._id'
      }
    }
    var match = {
      $match: {
        createdAt: {
          $gte: start_date,
          $lte: end_date
        }
      },
    };
    await appointment.aggregate([match, hospital_lookup, unwind_hospital, doctor_lookup, unwind_doctor, department_lookup, unwind_department, project, sort]).then((appointments) => {
      if (appointments) {
        res.status(200).json({ success: true, message: 'Success', data: appointments })
      } else {
        res.status(200).json({ success: false, message: 'No Data Found' })
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}