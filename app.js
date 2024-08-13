const express = require('express')
const userRoutes = require('./routes/userRoutes')

const app = express();
app.use(express.json());

app.disable('x-powered-by')

app.get('/',(req,res)=>{
    res.json({ message : 'hola mundo' })
})

//Usa las rutas de usuarios 
app.use('/api',userRoutes);


const PORT = process.env.PORT ?? 3001

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})