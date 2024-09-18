import express, { json } from 'express';
import userRoutes from './routes/userRoutes.js';
import productsRoutes from './routes/productsRoutes.js'
import comprasRoutes from './routes/comprasRoutes.js'
import limiter from './rateLimiter.js';
import helmet from 'helmet';


const app = express();

app.use(helmet())

/*
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "https://example.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: true,
    },
  }))
*//
app.use(json());
app.use(limiter);

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


//Usa las rutas de productos
app.use('/api2',productsRoutes);


//Usa las rutas de las compras
app.use('/api3',comprasRoutes);


const PORT = process.env.PORT ?? 3000

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})