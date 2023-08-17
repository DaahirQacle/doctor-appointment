import express from 'express'
<<<<<<< HEAD
import { admin_login, changePassword, change_password, get_all_admins, get_hospital_admins, reset_password, save_admin } from '../Controllers/admin.js'
import { createAppointment } from '../Controllers/test.js'
=======
import { admin_login, changePassword, change_password, get_all_admins, get_hospital_admins, get_hospital_single_admins, get_system_admins, reset_password, save_admin } from '../Controllers/admin.js'
>>>>>>> 9cfb77c92b38d1a76fbaac87b198ae44a1b0b889

const admin_route=express.Router()

admin_route.post('/create-admin', save_admin)

admin_route.post('/reset-admin-password', reset_password)

admin_route.post('/change-password', change_password)

admin_route.post('/change-passwords', changePassword)
admin_route.get('/get_all_admins', get_all_admins)
admin_route.get("/get_hospital_admins",get_hospital_admins)
admin_route.post("/admin_login", admin_login)
<<<<<<< HEAD
admin_route.post("/tests", createAppointment)
=======
admin_route.get("/get_system_admins",get_system_admins)
admin_route.get("/get_hospital_single_admins/:hospital_id",get_hospital_single_admins)
>>>>>>> 9cfb77c92b38d1a76fbaac87b198ae44a1b0b889
export default admin_route