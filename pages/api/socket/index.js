import { Server } from 'socket.io';
import Cors from 'cors';
import initMiddleware from '../../../lib/init-middleware';

// Initialize CORS middleware using Next.js custom middleware approach
const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    origin: '*',
  })
);

const ioHandler = async (req, res) => {
  await cors(req, res);

  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...');

    // Create socket.io server instance attached to HTTP server
    const io = new Server(res.socket.server, {
      cors: {
        origin: '*',
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected');
      socket.emit('event', { type: 'event', data: 'hello from IO' });

      socket.on('message', (message) => {
        console.log('Received message:', message);
        // Echo back the received message to all clients
        io.emit('message', `Event: ${message}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    // Attach io instance to server
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
