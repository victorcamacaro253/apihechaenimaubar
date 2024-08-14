const mysql = require('mysql2/promise');
require('dotenv').config(); // Asegúrate de instalar dotenv con `npm install dotenv`

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const pool = mysql.createPool(dbConfig);

pool.getConnection()
    .then(connection => {
        console.log('Conexión a la base de datos establecida.');
        connection.release();
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1);
    });

module.exports = pool;
