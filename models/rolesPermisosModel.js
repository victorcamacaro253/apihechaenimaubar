import { query } from "../db/db1.js";


const rolesPermisosModel={

    async getPermisosByrole(roleId){

        const sql='SELECT p.permiso FROM permisos p JOIN roles_permisos rp ON p.id=rp.permiso_id WHERE rp.rol_id= ?';

        const permisos = await query(sql,[roleId])

        return permisos

    }

}

export default rolesPermisosModel;