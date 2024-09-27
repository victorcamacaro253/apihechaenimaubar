import express, { json } from 'express';
import http from 'http';
import userRoutes from './routes/userRoutes.js';
import limiter from './rateLimiter.js';
import productosRoutes from './routes/productosRoutes.js'
import comprasRoutes from './routes/comprasRoutes.js'
import cors from 'cors'
import { setupWebSocket } from './services/websocketServer.js'; // Importa la función para configurar WebSocket
import notificationRoutes from './routes/notificationsRoutes.js'
import notificationUserRoutes from './routes/notificationUserRoutes.js'
import exportRoutes from './routes/exportRoutes.js'
import cookieParser from 'cookie-parser';
import csrf from 'csurf';


const app = express();


// Crear un servidor HTTP a partir de Express
const server = http.createServer(app);

// Configurar WebSocket
setupWebSocket(server);


app.use(cors())

const csrfProtection = csrf({cookie:true})

app.use(cookieParser());

app.use(limiter);
app.use(json());
app.disable('x-powered-by')

app.get('/',(req,res)=>{
    res.json({ message : 'hola mundo' })
})

app.get('/csrftoken',csrfProtection,(req,res)=>{
    //  Envia el token CSRF en una cookie llamada 'XSRF-TOKEN'
    res.cookie('XSRF-TOKEN',req.csrfToken())
    res.json({csrfToken:req.csrfToken()})
})

app.options('/api/users/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});
//Usa las rutas de usuarios 
app.use('/api',userRoutes);

app.use('/api2',productosRoutes);

app.use('/api3',csrfProtection,comprasRoutes);

app.use('/api4',notificationRoutes);

app.use('/api5',notificationUserRoutes);

app.use('/api6',exportRoutes);



const PORT = process.env.PORT ?? 3001

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})