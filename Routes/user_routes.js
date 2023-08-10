import express from 'express'
import { delete_user, get_all_users, get_user_by_id, get_user_history_by_id, get_users_report, login_user, register_user, reset_user_password, update_user } from '../Controllers/user.js'
import exp from 'constants'

const user_route=express.Router()
user_route.post('/register-user', register_user)
user_route.delete('/delete-user', delete_user)
user_route.get('/get-user-by-id', get_user_by_id)
user_route.post('/update-user', update_user)
user_route.get('/get-all-users', get_all_users)
user_route.get('/get-users-report', get_users_report)
user_route.get('/get_user_history_by_id/:user_id',get_user_history_by_id)
user_route.post('/login_user', login_user)
user_route.post('/reset_user_password', reset_user_password)
export default user_route