import { query } from "../db/db1.js";



const rolePermisosModel ={

    async getRoles(){
        const roles = await query('SELECT * FROM roles');
        return roles;
        

    },

    async  getRoleById(id){
        const role = await query('SELECT * FROM roles WHERE id = ?', id);
        return role;
        },
    
        async getRoleByName(name){
            const role = await query('SELECT * FROM roles WHERE rol = ?', name);
            return role;
            },

            async createRole(role){
                const result = await query('INSERT INTO roles (rol,created_at) VALUES(?,NOW())', role);
                return result;
                },

                async updateRole(id, role){
                    const result = await query('UPDATE roles SET rol= ? WHERE id_rol = ?', [role, id]);
                    return result;
                    },
                    async deleteRole(id){
                        const result = await query('DELETE FROM roles WHERE id_rol = ?', id);
                        return result;
                        },
                        
                  
                        async getPermisos(){
                            const permisos = await query('SELECT * FROM permisos');
                            return permisos;

                        },

                        async  getPermisoById(id){
                            const permiso = await query('SELECT * FROM permisos WHERE id = ?', id);
                            return permiso;
                            },

                            async getPermisoByName(name){
                                const sql='SELECT * FROM permisos WHERE permiso = ?'
                                const permiso = await query(sql, [name]);
                                return permiso;
                                },
                                
                                async createPermiso(permiso){
                                    const sql='INSERT INTO permisos (permiso,created_at) VALUES(?,?)'
                                    const result = await query(sql,[permiso]);
                                        return result;
                                        },

                                        async updatePermiso(id, permiso){
                                            const sql='UPDATE permisos SET permiso= ? WHERE id_permiso=?'
                                            const result = await query(sql,[permiso,id])
                                                return result;
                                         },

                                         async deletePermiso(){
                                            const sql='DELETE FROM permisos WHERE id_permiso=?'
                                            const result = await query(sql,id)
                                            return result;
                                         },
                                                

   

                          async getPermissionsByRole (roleId){
       
                            const sql = `
                         SELECT p.permiso
                          FROM permisos p
                           JOIN rol_permisos rp ON p.id = rp.permiso_id
                              WHERE rp.role_id = ?;
                               `;
    
                            try {
                        const results = await query(sql, [roleId]);
                        return results
                       } catch (error) {
                 console.error(error);
                throw new Error('Error en la consulta');
            }
        
    },
    
    
      
}

export default rolePermisosModel;