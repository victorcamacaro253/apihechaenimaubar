import express, { json } from 'express';
import session from 'express-session';
import limiter from './middleware/rateLimiter.js';
import http from 'http';
import helmet from 'helmet';
import routes from './routes/index.js';  // Importa el archivo de rutas
import cors from 'cors';
import passport from 'passport';
import morgan from 'morgan';
import { setupWebSocket } from './services/websocketServer.js'; // Importa la función para configurar WebSocket
import authRoutes from './routes/authRoutes.js';  // Rutas de autenticación
import './controllers/authControllers.js';  // Asegúrate de que se configure passport
import './controllers/authFacebookControllers.js'
import './controllers/authGithubControllers.js'
import './controllers/authTwitterControllers.js'
import './controllers/openIDConnect.js'


const app = express();


// Crear un servidor HTTP a partir de Express
const server = http.createServer(app);

// Configurar WebSocket
setupWebSocket(server);



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

app.use(morgan('dev'));  // 'dev' es para formato de desarrollo



// Rutas de autenticación
app.use(authRoutes);

app.use(cors())
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


// Rutas
app.use(routes);  // Usa el archivo de rutas


const PORT = process.env.PORT ?? 3000

server.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})