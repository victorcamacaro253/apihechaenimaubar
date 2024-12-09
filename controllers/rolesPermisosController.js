import rolesPermisosModel from "../models/rolesPermisosModel.js";

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
                const {name} = req.query
                const roles =  await rolesPermisosModel.getRoleByName(name)
                if (!roles){
                    return res.status(404).json({message: 'Rol no encontrado'})
                    }

                    res.json(roles)

        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Error al obtener los roles'})
        }
    }




  static   createRole= async (req,res)=>{
    try{
        const {rol,description} = req.body

   const exisitngRole= await  rolesPermisosModel.getRoleByName(rol)

   if (exisitngRole.length> 0) {
    return res.status(400).json({message: 'Rol ya existe'})

    
   }

          await rolesPermisosModel.createRole(rol,description)

    


        res.status(201).json({message:"Rol creado exitosamente"})
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


         static getPermisos = async (req,res)=>{
            try{
                const permisos =  await rolesPermisosModel.getPermisos()
                res.json(permisos)
                }catch(error){
                    console.log(error)
                    res.status(500).json({message: 'Error al obtener los permisos'})
                    }

         }



         static getPermisosById=  async (req,res)=>{
            const {id}=  req.params
            try{
                const permisos =  await rolesPermisosModel.getPermisosById(id)
                if(permisos.length===0){
                    res.status(404).json({message: 'No se encontraron permisos para el rol'})

                }
                res.json(permisos)
                }catch(error){
                    console.log(error)
                    res.status(500).json({message: 'Error al obtener los permisos del rol'})
                        }
                        
                        }


                        static getPermisosByName=   async (req,res)=>{
                            const {name}=  req.query
                            try{
                                const permisos =  await rolesPermisosModel.getPermisoByName(name)
                                if(permisos.length===0){
                                    res.status(404).json({message: 'No se encontraron permisos con ese nombre'})
                                        }



                                        res.status(200).json(permisos)
                                        }catch(error){
                                            console.log(error)
                                            res.status(500).json({message: 'Error al obtener el permiso con ese nombre'})
                                            }
                                            



                                            }
                                            

      static createPermiso= async (req,res)=>{
        const {name}= req.body
        try{
            const permiso = await rolesPermisosModel.createPermiso(name)
            res.json(permiso)
            }catch(error){
                console.log(error)
                res.status(500).json({message: 'Error al crear el permiso'})
                }

      }


      static updatePermiso = async (req,res)=>{
        const {id}= req.params
        const {name}= req.body
        try {
            const permiso = await rolesPermisosModel.updatePermiso(id,name)
            res.json(permiso)
            
            
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'Error al actualizar el permiso'})
            
        }
      }


      static deletePermiso  = async (req,res)=>{
        const {id}= req.params
        try{
            const permiso = await rolesPermisosModel.deletePermiso(id)
            if(permiso.length===0){
                res.json({message: 'El permiso no existe'})
            }
            res.json(permiso)
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Error al eliminar el permiso'})
        }
    }

    static getPermisosByRole= async (req,res)=>{
        const {id}= req.params
        try{
            const permiso = await rolesPermisosModel.getPermisosByRole(id)
            res.json(permiso)
            }catch(error){

                console.log(error)
                res.status(500).json({message: 'Error al obtener los permisos del rol'})

                
            }

                }



    }
    



export default rolesPermisosController
