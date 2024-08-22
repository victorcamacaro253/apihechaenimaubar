const express = require('express')
const userRoutes = require('./routes/userRoutes')
const app = express();


app.use(express.json());
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


const PORT = process.env.PORT ?? 3001

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})