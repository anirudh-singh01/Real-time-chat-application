const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Function to generate a dynamic, unique symbol for each user
const generateAvatar = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
  const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number to append
  return `${randomLetter}${randomNumber}`;  // e.g., "A1234"
};

let assignedSymbols = {};  // To track users and their symbols

io.on('connection', (socket) => {
  const avatar = generateAvatar(); // Generate a unique avatar for the user
  assignedSymbols[socket.id] = avatar;

  console.log('A user connected:', socket.id, 'Assigned Avatar:', avatar);

  // Send the assigned avatar back to the connected user
  socket.emit('assignAvatar', avatar);

  socket.on('sendMessage', (message) => {
    const fullMessage = { ...message, avatar: assignedSymbols[socket.id] };
    io.emit('receiveMessage', fullMessage); // Send the message to all users
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    delete assignedSymbols[socket.id];  // Remove the user's symbol when they disconnect
  });
});

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});
