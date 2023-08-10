import express from 'express'
import { create_appointment, get_all_appointments, get_appointment_by_user_id, get_appointments_by_hospital_id_and_status, get_appointments_report, get_appointments_report_by_hospital_id, update_appointment_status } from '../Controllers/appointment.js'

const appointment_route=express.Router()

appointment_route.post("/create-appointment", create_appointment)
appointment_route.post("/update-appointment-status/:appointment_id", update_appointment_status)
appointment_route.get('/get-all-appointments/:status', get_all_appointments)
appointment_route.get('/get-appointment-by-user-id', get_appointment_by_user_id)
appointment_route.get('/get-appointments-report/:start/:end', get_appointments_report)
appointment_route.get('/get_appointments_by_hospital_id_and_status/:hospital_id/:status', get_appointments_by_hospital_id_and_status)
// appointment_route.get('/get_appointments_by_hospital_id_and_status/:hospital_id',get_appointments_by_hospital_id_and_status)
appointment_route.post('/get_appointments_report_by_hospital_id/:hospital_id/:start/:end',get_appointments_report_by_hospital_id)
export default appointment_route