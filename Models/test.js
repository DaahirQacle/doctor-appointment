import mongoose from 'mongoose';

const doctorAppointmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  intervalTime: {
    type: Number,
    required: true,
  },
  doctorEntryTime: {
    type: Date,
    required: true,
  },
  doctorLeaveTime: {
    type: Date,
    required: true,
  },
});

const DoctorAppointment = mongoose.model('DoctorAppointment', doctorAppointmentSchema);

export default DoctorAppointment;