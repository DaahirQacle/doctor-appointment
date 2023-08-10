import Register from "../Models/register.js"

 const createRegister = async(req,res)=>{
    try {
        const create = await Register.create(req.body);
        res.status(200).json({message:'Created Success Fully',status:true})
    } catch (error) {
        res.status(500).json({message:error,status:false})
    }
}

 const updateRegister = async(req,res)=>{
    try {
        const data = await Register.findByIdAndUpdate(req.params.id,req.body,{ new: true })
        res.status(200).json({message:'Updated Success Fully',status:true , info:data})
    } catch (error) {
        res.status(500).json({message:error,status:false})
    }
}

 const deleteRegister = async(req,res)=>{
    try {
        const data = await Register.findByIdAndDelete(req.params.id)
        res.status(200).json({message:'Deleted...',status:true})
    } catch (error) {
        res.status(500).json({message:error,status:false})
    }
}

 const fetchRegister = async(req,res)=>{
    try {
        const data = await Register.find()
        res.status(200).json({message:data,status:true})
       
    } catch (error) {
        res.status(500).json({message:error,status:false})
    }
}

export{createRegister , updateRegister,deleteRegister,fetchRegister}