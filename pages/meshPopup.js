import React, { useState, useEffect } from 'react';
import { createLink } from '@meshconnect/web-link-sdk';
import { useSocketIO } from '../context/WebSocketContext';

const MeshPopup = () => {
  const [linkConnection, setLinkConnection] = useState(null);
  const [linkToken, setLinkToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { socket, sendMessage } = useSocketIO();

  useEffect(() => {
    fetchLinkToken();
  }, []);

  useEffect(() => {
    if (linkToken) {
      const link = createLink({
        clientId: process.env.MESH_CLIENTID,
        onIntegrationConnected: (data) => {
          console.log('Integration connected:', data);
        },
        onEvent: (event) => {
          console.info('Mesh EVENT', event);
          if (socket && socket.connected) {
            console.log("About to send Socket message")
            sendMessage(JSON.stringify(event));
          } else {
            console.error('Socket.IO is not connected. Cannot send event.');
          }

          if (event.type === 'close') {
            console.log('Close event occurred in Mesh modal');
            window.close();
          }
        },
        onExit: (error) => {
          if (error) {
            console.error('Link exited with error:', error);
          } else {
            console.log('Link exited successfully');
          }
        }
      });
      setLinkConnection(link);
      openMeshIntegration(link);
    }
  }, [linkToken, socket, sendMessage]);

  const fetchLinkToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/linkTokenCall');
      if (!response.ok) {
        throw new Error('Failed to fetch link token');
      }
      const result = await response.json();
      setLinkToken(result.linkToken);
    } catch (error) {
      console.error('Error fetching link token:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openMeshIntegration = async (link) => {
    if (!linkToken) {
      setError('Link token not fetched yet.');
      return;
    }

    try {
      await link.openLink(linkToken, {
        onSuccess: () => {
          console.log('Link opened successfully in popup');
        },
        onError: (error) => {
          console.error('Error opening link in popup:', error);
          alert('Failed to open link. Please try again.');
        }
      });
    } catch (error) {
      console.error('Error opening link in popup:', error);
      alert('Failed to open link. Please try again.');
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <p>Error: {error}</p>}
          {!loading && !error && <p>Opening Mesh integration...</p>}
        </>
      )}
    </div>
  );
};

export default MeshPopup;