import express from "express"
import { activate_or_deactivate_doctor, createDoctor, deleteDoctor, fetchDoctors, fetchDoctors_for_app, generate_doctor_appointments, get_doctor_appointments, get_doctor_by_id, get_doctor_report, get_doctors_by_department_id, get_doctors_by_hospital_id, get_doctors_report_by_hospital_id, updateDoctor, update_doctor_appointments } from "../Controllers/doctors.js"


const route = express.Router()

route.post('/create-doctor' ,createDoctor)

route.patch('/update-doctor/:id' ,updateDoctor)

route.delete('/delete-doctor/:id' ,deleteDoctor)
// 
route.get('/fetch-doctor' ,fetchDoctors)
route.get('/fetch_all_doctors_for_app' ,fetchDoctors_for_app)

route.get('/get_doctor_by_id/:doctor_id', get_doctor_by_id)

route.get('/get_doctors_by_department_id/:department_id', get_doctors_by_department_id)
route.get('/get_doctors_by_department_id_for_app/:department_id', get_doctors_by_department_id)

route.get('/get_doctors_by_hospital_id/:id', get_doctors_by_hospital_id)
route.get('/get_doctor_report/:start?/:end?', get_doctor_report)
route.get('/get_doctors_report_by_hospital_id/:hospital_id/:start/:end', get_doctors_report_by_hospital_id)
route.post('/update_doctor_appointments', update_doctor_appointments)
route.post('/activate_or_deactivate_doctor', activate_or_deactivate_doctor)
route.post('/generate_doctor_appointments', generate_doctor_appointments)
route.get('/get_doctor_appointments/:doctor_id', get_doctor_appointments)

export default route