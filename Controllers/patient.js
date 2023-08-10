import Patient from "../Models/patient.js"

 const createPatient = async(req,res)=>{
    try {
        const create = await Patient.create(req.body);
        res.status(200).json({message:'Created Success Fully',status:true})
    } catch (error) {
        res.status(500).json({message:error,status:false})
    }
}

 const updatePatient = async(req,res)=>{
    try {
        const data = await Patient.findByIdAndUpdate(req.params.id,req.body,{ new: true })
        res.status(200).json({message:'Updated Success Fully',status:true , info:data})
    } catch (error) {
        res.status(500).json({message:error,status:false})
    }
}

 const deletPatients = async(req,res)=>{
    try {
        const data = await Patient.findByIdAndDelete(req.params.id)
        res.status(200).json({message:'Deleted...',status:true})
    } catch (error) {
        res.status(500).json({message:error,status:false})
    }
}

 const fetchPatient = async(req,res)=>{
    try {
        const data = await Patient.find()
        res.status(200).json({message:data,status:true})
       
    } catch (error) {
        res.status(500).json({message:error,status:false})
    }
}

export{createPatient , updatePatient,deletPatients,fetchPatient}