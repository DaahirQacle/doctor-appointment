import DoctorAppointment from  '../Models/test.js';

 const generateAppointments = (intervalTime, doctorEntryTime, doctorLeaveTime) => {
  const appointments = [];
  let currentTime = new Date(doctorEntryTime);

  while (currentTime < doctorLeaveTime) {
    const appointment = new DoctorAppointment({
      title: "Appointment",
      time: currentTime.toLocaleTimeString([], { timeStyle: "short" }),
      intervalTime,
      doctorEntryTime,
      doctorLeaveTime,
    });

    appointments.push(appointment);

    currentTime.setMinutes(currentTime.getMinutes() + intervalTime);
  }

  return appointments;
};

// Controller function to create a new doctor appointment
export const createAppointment = async (req, res) => {
  try {
    const { intervalTime, doctorEntryTime, doctorLeaveTime } = req.body;

    const appointments = generateAppointments(intervalTime, new Date(doctorEntryTime), new Date(doctorLeaveTime));

    const savedAppointments = await DoctorAppointment.insertMany(appointments);

    res.status(201).json(savedAppointments);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the appointments.' });
  }
};
