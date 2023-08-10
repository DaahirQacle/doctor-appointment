import express from 'express'
import { create_emergency, get_all_emergencies, get_all_emergencies_report, get_emergency_by_hospital_id, get_emergency_by_hospital_id_and_status, get_emergency_reports_by_hospital_id, update_emergency_status } from '../Controllers/emergency.js'

const emergency_route=express.Router()

emergency_route.post('/create_emergency', create_emergency)

emergency_route.get('/get_emergency_by_hospital_id/:hospital_id', get_emergency_by_hospital_id)

emergency_route.get('/get_all_emergencies', get_all_emergencies)

emergency_route.get('/get_emergency_by_hospital_id_and_status/:hospital_id/:status', get_emergency_by_hospital_id_and_status)

emergency_route.post('/update_emergency_status/:emergency_id',update_emergency_status)

emergency_route.post('/get_all_emergencies_report/:start/:end',get_all_emergencies_report)

emergency_route.post('/get_all_emergencies/:status',get_all_emergencies)                                                    // used
emergency_route.post('/get_emergency_reports_by_hospital_id/:hospital_id/:start/:end',get_emergency_reports_by_hospital_id)  // used
export default emergency_route