import React, { useState, useEffect } from 'react';
import { createLink } from '@meshconnect/web-link-sdk';
import { useSocketIO } from '../context/WebSocketContext';
import './MeshPopup.css';

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

    const urlParams = new URLSearchParams(window.location.search);
    const broker = urlParams.get('broker');

    try {
      const response = await fetch(`/api/linkTokenCall${broker ? `?broker=${broker}` : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch link token');
      }
      const result = await response.json();
      setLinkToken(result.linkToken);
    } catch (error) {
      setError('Failed to fetch link token. Please try again.');
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
          setError('Failed to open link. Please try again.');
        }
      });
    } catch (error) {
      setError('Failed to open link. Please try again.');
    }
  };

  return (
    <div className="mesh-popup">
      {loading && <div className="loader"></div>}
      {!loading && error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}
      {!loading && !error && (
        <div className="success-message">
          <p>Re-open Mesh through the Extension and close this window</p>
        </div>
      )}
    </div>
  );
};

export default MeshPopup;
