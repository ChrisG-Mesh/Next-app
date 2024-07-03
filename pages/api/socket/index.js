import { Server } from 'socket.io';

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...');
    const io = new Server(res.socket.server);

    io.on('connection', (socket) => {
      console.log('Client connected');

      const interval = setInterval(() => {
        socket.emit('event', { type: 'event', data: 'Hello from middleware app!' });
      }, 5000);

      socket.on('message', (message) => {
        console.log('Received:', message);
      });

      socket.on('disconnect', () => {
        clearInterval(interval);
        console.log('Client disconnected');
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('Socket.IO server already initialized.');
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false, // Disable body parsing (required for WebSocket)
  },
};

export default ioHandler;