import rolesPermisosController from "../controllers/rolesPermisosController.js";
import { Router } from "express";

const router=  Router();

router.get('/roles/', rolesPermisosController.getRoles);   
router.get('/roles/rol',rolesPermisosController.getRoleByName) 
router.get('roles/:id', rolesPermisosController.getRolesById);

router.post('/roles/', rolesPermisosController.createRole);
router.put('roles/:id', rolesPermisosController.updateRole);
router.delete('roles/:id', rolesPermisosController.deleteRole);

router.get('/permisos',rolesPermisosController.getPermisos)

router.get('/permisos/permiso',rolesPermisosController.getPermisosByName)

router.get('/permisos/:id',rolesPermisosController.getPermisosById)



router.post('/permisos/', rolesPermisosController.createPermiso); // para crear un nuevo

router.put('/:id', rolesPermisosController.updatePermiso); // para actualizar un existente


router.delete('/:id', rolesPermisosController.deletePermiso); // para eliminar un permiso 


 export  default router;

