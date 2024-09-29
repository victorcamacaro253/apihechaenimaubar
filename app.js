import express, { json } from 'express';
import session from 'express-session';
import userRoutes from './routes/userRoutes.js';
import productsRoutes from './routes/productsRoutes.js'
import comprasRoutes from './routes/comprasRoutes.js'
import limiter from './rateLimiter.js';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import exportRoutes from './routes/exportRoutes.js' 
import passport from 'passport';
import authRoutes from './routes/authRoutes.js';  // Rutas de autenticación
import './controllers/authControllers.js';  // Asegúrate de que se configure passport
import './controllers/authFacebookControllers.js'
import './controllers/authGithubControllers.js'
import './controllers/authTwitterControllers.js'
const app = express();


// Configuración de la sesión
app.use(session({
  secret: 'victorcamacaro',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Cambia a true en producción con HTTPS
}));

// Inicializa passport y sesiones
app.use(passport.initialize());
app.use(passport.session());

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
*/
// Rutas de autenticación
app.use(authRoutes);

app.use(cors())
app.use(json());
app.use(limiter);

app.disable('x-powered-by')

// Añadir protección CSRF con cookies
const csrfProtection = csrf({ cookie: true });
// Middleware para procesar cookies
app.use(cookieParser());





app.get('/',(req,res)=>{
    res.json({ message : 'hola mundo' })
})


// Generar y enviar el token CSRF en una ruta
app.get('/csrf-token', csrfProtection, (req, res) => {
  // Envía el token CSRF en una cookie llamada 'XSRF-TOKEN'
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.json({ csrfToken: req.csrfToken() });
});

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

//Usa las rutas para exportar documentos
app.use('/api4',exportRoutes);

const PORT = process.env.PORT ?? 3000

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})