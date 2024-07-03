import React, { createContext, useContext, useEffect, useState } from 'react';
const WebSocketContext = createContext(null);
export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000');
    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received event from middleware app:', message);
    };
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    setWs(socket);
    return () => {
      socket.close();
    };
  }, []);
  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
};
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};