import express, { json } from 'express';
import userRoutes from './routes/userRoutes.js';
const app = express();


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


const PORT = process.env.PORT ?? 3000

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})