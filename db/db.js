// Importa el módulo 'mysql2' y 'dotenv'
const mysql = require('mysql2');
require('dotenv').config(); // Asegúrate de tener un archivo .env con las variables de entorno

// Crea una conexión a la base de datos
const connection = mysql.createConnection({
  host: process.env.DB_HOST, // Obtén estos valores del archivo .env
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Conecta a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos como id ' + connection.threadId);
});

// Maneja la desconexión
process.on('SIGINT', () => {
  connection.end((err) => {
    if (err) {
      console.error('Error al cerrar la conexión a la base de datos:', err.stack);
    }
    console.log('Conexión a la base de datos cerrada');
    process.exit(0);
  });
});

// Exporta la conexión
module.exports = connection;