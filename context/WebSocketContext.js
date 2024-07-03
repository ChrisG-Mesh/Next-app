import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketIOContext = createContext(null);

export const SocketIOProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('event', (data) => {
      console.log('Socket.IO event received:', data);
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO connection closed');
    });

    setSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (message) => {
    if (socket && socket.connected) {
      console.log('sendMessage executed', message)
      socket.emit('message', message);
    } else {
      console.error('Socket.IO is not connected, cannot send message');
    }
  };

  return (
    <SocketIOContext.Provider value={{ socket, sendMessage }}>
      {children}
    </SocketIOContext.Provider>
  );
};

export const useSocketIO = () => {
  return useContext(SocketIOContext);
};