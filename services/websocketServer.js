//services/websocketServer.js
import { Server as SocketIOServer } from "socket.io";

let io; // Variable para almacenar la instancia de Socket.IO

// Crear y exportar una función para configurar socket.io
export const setupWebSocket = (httpServer) => {
    io = new SocketIOServer(httpServer);

    io.on('connection', (socket) => {
        console.log('Cliente socket.io conectado');

        // Manejar eventos de mensajes
        socket.on('message', (msg) => {
            console.log(`Mensaje recibido: ${msg}`);
        });

        // Enviar un mensaje de bienvenida al cliente
        socket.emit('Welcome', 'Bienvenido al servidor de websocket');

        socket.on('disconnect', () => {
            console.log('Cliente socket.io desconectado');
        });
    });

    return io;
};

// Exportar la instancia de io para que pueda ser usada en otros archivos
export const getIo = () => io;
