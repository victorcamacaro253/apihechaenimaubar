import rolesPermisosModel from "../models/rolesPermisosModel";

class rolesPermisosController{


    static getRoles= async (req,res)=>{
        try{
            const roles =  await rolesPermisosModel.getRoles()

            res.json(roles)

    }catch(error){
        console.log(error)
        res.status(500).json({message: 'Error al obtener los roles'})

    }


}


 static  getRolesById= async (req,res)=>{
    try{
        const {id} = req.params
        const roles =  await rolesPermisosModel.getRoleById(id)
        if (!roles){
            return res.status(404).json({message: 'Rol no encontrado'})
            }


        res.json(roles)
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Error al obtener los roles'})
            
        }


        }

        static getRoleByName=async  (req,res)=>{

            try{
                const {name} = req.params
                const roles =  await rolesPermisosModel.getRoleByName(name)
                if (!roles){
                    return res.status(404).json({message: 'Rol no encontrado'})
                    }

        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Error al obtener los roles'})
        }
    }




  static   createRole= async (req,res)=>{
    try{
        const {rol,description} = req.body
        const roles =  await rolesPermisosModel.createRole(rol,description)
        res.status(201).json({message:"Role creado exitosamente"})
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Error al crear el rol'})


        }

}


static   updateRole= async (req,res)=>{
    try{
        const {id} = req.params
        const {rol,description} = req.body

        const updateFields=[]
        const values=[]
        if(rol){
            values.push('rol')
            updateFields.push(rol)
            }
            if(description){
                values.push('description')
                updateFields.push(description)
                }
                const roles =  await rolesPermisosModel.updateRole(id,updateFields,values)


    
        res.json({message:"Rol actualizado exitosamente"})
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Error al actualizar el rol'})
            }

         }



         static deleteRole= async (req,res)=>{
           const {id}=  req.params
           try{
            const roles =  await rolesPermisosModel.deleteRole(id)
            res.json({message:"Rol eliminado exitosamente"})
            }catch(error){
                console.log(error)
                res.status(500).json({message: 'Error al eliminar el rol'})
                }


         }


}

export default rolesPermisosController
