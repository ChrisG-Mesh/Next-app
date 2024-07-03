import { useEffect } from 'react';
import { SocketIOProvider } from '../context/WebSocketContext';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    fetch('/api/socket')
      .then((response) => {
        if (response.ok) {
          console.log('Socket.IO endpoint initialized');
        } else {
          console.error('Failed to initialize Socket.IO endpoint');
        }
      })
      .catch((error) => console.error('Error initializing Socket.IO endpoint:', error));
  }, []);

  return (
    <SocketIOProvider>
      <Component {...pageProps} />
    </SocketIOProvider>
  );
}

export default MyApp;