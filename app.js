import express, { json } from 'express';
import http from 'http';
import userRoutes from './routes/userRoutes.js';
import limiter from './rateLimiter.js';
import productosRoutes from './routes/productosRoutes.js'
import comprasRoutes from './routes/comprasRoutes.js'
import cors from 'cors'
import { setupWebSocket } from './services/websocketServer.js'; // Importa la función para configurar WebSocket
import notificationRoutes from './routes/notificationsRoutes.js'

const app = express();


// Crear un servidor HTTP a partir de Express
const server = http.createServer(app);

// Configurar WebSocket
setupWebSocket(server);


app.use(cors())
app.use(limiter);
app.use(json());
app.disable('x-powered-by')

app.get('/',(req,res)=>{
    res.json({ message : 'hola mundo' })
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

app.use('/api3',comprasRoutes);

app.use('/api4',notificationRoutes);



const PORT = process.env.PORT ?? 3001

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})