// pages/api/linkTokenCall.js

import Cors from 'cors';
import initMiddleware from '../../../lib/init-middleware';

const cors = initMiddleware(
  Cors({
    methods: ['POST', 'OPTIONS', 'GET'],
    origin: '*',
  })
);

async function handler(req, res) {
  await cors(req, res);

  const { broker } = req.query;

  let integrationId;

  if (broker) {
    switch (broker) {
      case 'Coinbase':
        integrationId = '47624467-e52e-4938-a41a-7926b6c27acf';
        break;
      case 'Binance':
        integrationId = '9226e5c2-ebc3-4fdd-94f6-ed52cdce1420';
        break;
      case 'Robinhood':
        integrationId = '6e192ebb-a073-4055-bbd7-d644539c9a20';
        break;
      default:
        return res.status(400).json({ error: 'Invalid broker specified' });
    }
  }

  try {
    const requestBody = {
      userId: process.env.MESH_USERID,
      ...(integrationId && { integrationId }), // Conditionally add the integrationId
    };

    const response = await fetch(`${process.env.MESH_URL}/api/v1/linktoken`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-client-id': process.env.MESH_CLIENTID,
        'x-client-secret': process.env.MESH_APIKEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Network response error API call');
    }

    const data = await response.json();
    const linkToken = data.content.linkToken;

    res.status(200).json({ linkToken });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default handler;
