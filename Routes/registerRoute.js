import express from "express"
import { createRegister, deleteRegister, fetchRegister, updateRegister } from "../Controllers/register.js"

const route = express.Router()

route.post('/create-register' ,createRegister)

route.patch('/update-register/:id' ,updateRegister)

route.delete('/delete-register/:id' ,deleteRegister)

route.get('/fetch-register' ,fetchRegister)

export default route