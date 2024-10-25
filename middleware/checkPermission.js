import rolesPermisosModel from "../models/rolesPermisosModel.js";

const checkPermissions = (requiredPermission) => {
  return async (req, res, next) => {
    const roleId = req.user.rol;

    try {
      const permisos = await rolesPermisosModel.getPermisosByrole(roleId);
      console.log(`Permisos para el rol ${roleId}:`, permisos); // Verifica los permisos en consola

      if (!permisos || permisos.length === 0) {
        return res.status(403).json({ message: 'Permiso denegado.' });
      }

      // Verifica si el rol tiene el permiso requerido
      const hasPermission = permisos.find((permiso) => permiso.permiso === requiredPermission);

      if (!hasPermission) {
        return res.status(403).json({ message: 'Permiso denegado.' });
      }

      next(); // Si tiene permiso, continuar al siguiente middleware o controlador

    } catch (error) {
      console.error(error); // Log del error para depuración
      return res.status(500).json({ message: 'Error al obtener permisos del rol' });
    }
  };
};

export default checkPermissions;