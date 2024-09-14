// redisClient.js
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();  // Cargar variables de entorno desde .env

// Crear el cliente de Redis
const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

// Conectar al servidor Redis
client.connect().catch(err => {
    console.error('Error al conectar a Redis', err);
});

// Exportar el cliente de Redis para su uso en otros archivos
export default client;
