import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Asegúrate de instalar dotenv con `npm install dotenv`

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const pool = createPool(dbConfig);

// Verifica la conexión al iniciar
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión a la base de datos establecida.');
        connection.release(); // Libera la conexión después de la verificación
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1); // Termina el proceso si hay un error en la conexión
    }
})();

const query = async (sql, params = []) => {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(sql, params);
        return results;
    } finally {
        connection.release(); // Asegúrate de liberar la conexión
    }
};

export { pool, query };
