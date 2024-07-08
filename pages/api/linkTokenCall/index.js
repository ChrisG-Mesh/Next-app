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

  try {
    console.log("in the api call for linktoken");
    const response = await fetch(`https://integration-api.meshconnect.com/api/v1/linktoken`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-client-id': process.env.CLIENT_ID,
        'x-client-secret': process.env.MESH_APIKEY,
      },
      body: JSON.stringify({
        userId: process.env.MESH_USERID,
      }),
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