
const routeNotFound = (req,res,next)=>{
    res.status(404).json({message:'Ruta no encontrada '})
}


const serverError= (err,req,res,next)=>{
console.log(err.stack)
res.status(500).json({message:'Ocurrio un error del servidor '})
}

export default {routeNotFound,serverError}