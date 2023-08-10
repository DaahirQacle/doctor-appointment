import express from "express"
import { approve_decline_hospital, createHospital, deleteHospital, edit_hospital_profile, fetchHospital, fetchHospitals_for_app, get_emergency_hospitals, get_hospital_by_id, get_hospitals_report, loginUsers, open_or_close_hospital, updateHospital, update_hospital_emergency } from "../Controllers/hostipal.js"

const route = express.Router()
route.post('/create-hospital' ,createHospital)
route.patch('/update-hospital/:id' ,updateHospital)
route.delete('/delete-hospital/:id' ,deleteHospital)
route.get('/fetch-all-hospitals' ,fetchHospital)
route.get('/fetch_all_hospitals_for_app' ,fetchHospitals_for_app)
//route.get('/get-hospital-report/:start/:end' ,hospitalReport)
route.get("/get_hospitals_report/:start?/:end?", get_hospitals_report)
route.get('/get_hospital_by_id/:id', get_hospital_by_id)
// route.post("/get_hospital_report", get_hospital_report)
// route.get('/get_hospital_by_id/:id', get_hospital_by_id)
route.post('/edit-hospital-profile', edit_hospital_profile)
route.get('/get_emergency_hospitals', get_emergency_hospitals)
route.post('/open_or_close_hospital', open_or_close_hospital)
route.post('/update_hospital_emergency', update_hospital_emergency)
route.post('/approve_decline_hospital', approve_decline_hospital)
route.post('/login' ,loginUsers)


export default route