import express, { json } from 'express';
import userRoutes from './routes/userRoutes.js';
import limiter from './rateLimiter.js';
import productosRoutes from './routes/productosRoutes.js'
import comprasRoutes from './routes/comprasRoutes.js'
import cors from 'cors'


const app = express();

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

const PORT = process.env.PORT ?? 3001

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})