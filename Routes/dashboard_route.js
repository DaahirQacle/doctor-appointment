import express from 'express'
import {get_active_doctors_by_hospital_id, get_admin_dashboard, get_departments_summary_by_hospital_id, get_hospital_dashboard, get_hospitals_summary, get_login_summary } from '../Controllers/dashboard.js'

const dashboard_route=express.Router()
dashboard_route.get('/get_admin_dashboard', get_admin_dashboard)
dashboard_route.get('/get_hospital_dashboard/:hospital_id', get_hospital_dashboard)
dashboard_route.get('/get_login_summary', get_login_summary)
dashboard_route.get("/get_hospitals_summary",get_hospitals_summary)
dashboard_route.get('/get_hospitals_summary',get_hospitals_summary)
dashboard_route.get('/get_departments_summary_by_hospital_id/:id',get_departments_summary_by_hospital_id)
dashboard_route.get("/get_active_doctors_by_hospital_id/:id",get_active_doctors_by_hospital_id)
export default dashboard_route