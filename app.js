import express, { json } from 'express';
import empleadosRoutes from './routes/EmpleadosRoutes.js';
import administradoresRoutes from './routes/administradoresRoutes.js'
import bienesRoutes from './routes/bienesRoutes.js'
import helmet from 'helmet';
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser'; // <-- Agrega esto
import csrf from 'csurf'; // <-- Agrega esto también


// Get the current file's directory (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(cors())
// Añadir protección CSRF con cookies
const csrfProtection = csrf({ cookie: true });
// Middleware para procesar cookies
app.use(cookieParser());


app.use(json());
app.disable('x-powered-by')

app.use(helmet());

app.use('/uploads',express.static(path.join(__dirname,'uploads')));


// Generar y enviar el token CSRF en una ruta
app.get('/csrf-token', csrfProtection, (req, res) => {
    // Envía el token CSRF en una cookie llamada 'XSRF-TOKEN'
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.json({ csrfToken: req.csrfToken() });
  });
  

app.use('/api',csrfProtection,empleadosRoutes);

app.use('/api2',administradoresRoutes);

app.use('/api3',bienesRoutes);


const PORT = process.env.PORT ?? 3001

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})