import pkg from 'jsonwebtoken';
const { verify } = pkg;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extraer el token del encabezado

    if (token == null) return res.status(401).json({ error: 'Token no proporcionado' });

    verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token no válido' });

        req.user = user; // Guardar los datos del usuario en la solicitud
        next();
    });
};

export default authenticateToken;
