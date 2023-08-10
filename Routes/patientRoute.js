import express from "express"
import { createPatient, deletPatients, fetchPatient, updatePatient } from "../Controllers/patient.js"


const route = express.Router()

route.post('/create-patient' ,createPatient)

route.patch('/update-patient/:id' ,updatePatient)

route.delete('/delete-patient/:id' ,deletPatients)

route.get('/fetch-patient' ,fetchPatient)

export default route