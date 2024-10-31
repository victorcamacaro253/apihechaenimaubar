import rolesPermisosController from "../controllers/rolesPermisosController.js";
import { Router } from "express";

const router=  Router();

router.get('/', rolesPermisosController.getRoles);    
//router.get('/:id', rolesPermisosController.listarUno);
//router.post('/', rolesPermisosController.crear);
//router.put('/:id', rolesPermisosController.actualizar);
//router.delete('/:id', rolesPermisosController.eliminar);
//router.get('/:id', rolesPermisosController.listarUno); // para obtener un solo
//router.post('/', rolesPermisosController.crear); // para crear un nuevo
//router.put('/:id', rolesPermisosController.actualizar); // para actualizar un existente
//router.delete('/:id', rolesPermisosController.eliminar); // para eliminar un exist
 export  default router;

