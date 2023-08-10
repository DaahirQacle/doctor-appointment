import express from "express"
import { createDepartment, deleteDepartment, fetchDepartment, get_department_by_id, get_departments_by_hospital_id, get_departments_by_hospital_id_for_app, get_departments_report, get_departments_report_by_hospital_id, get_departments_those_have_doctor, updateDepartment } from "../Controllers/department.js"

const route = express.Router()

route.post('/create-dept' ,createDepartment)

route.patch('/update-dept/:id' ,updateDepartment)

route.delete('/delete-dept/:id' ,deleteDepartment)

route.get('/fetch-dept' ,fetchDepartment)
// route.post('/get_department-report', get_department_report)
route.get('/get_department_by_id', get_department_by_id)
route.get('/get_departments_by_hospital_id/:id', get_departments_by_hospital_id)
route.get('/get_departments_by_hospital_id_for_app/:id', get_departments_by_hospital_id_for_app)

route.get('/get_department-report/:start?/:end?', get_departments_report)
route.get('/get_departments_report_by_hospital_id', get_departments_report_by_hospital_id)

route.get('/get_department-report-by-hospital-id/:hospital_id/:start?/:end?', get_departments_report_by_hospital_id)
route.get('/get_departments_those_have_doctor/:hospital_id',get_departments_those_have_doctor)
export default route