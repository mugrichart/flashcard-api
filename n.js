// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//     cors: {
//         origin: '*',
//         methods: ['GET', 'POST']
//     }
// });

// const users = {}; // Store user socket connections

// io.on('connection', (socket) => {
//     console.log('New user connected:', socket.id);
    
//     socket.on('join-room', (roomId, userId) => {
//         socket.join(roomId);
//         users[socket.id] = roomId;
        
//         // Notify others in the room
//         socket.to(roomId).emit('user-connected', userId);
//     });

//     socket.on('signal', (data) => {
//         io.to(data.target).emit('signal', { sender: socket.id, signal: data.signal });
//     });

//     socket.on('disconnect', () => {
//         const roomId = users[socket.id];
//         if (roomId) {
//             socket.to(roomId).emit('user-disconnected', socket.id);
//             delete users[socket.id];
//         }
//     });

// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Signaling server running on port ${PORT}`));
