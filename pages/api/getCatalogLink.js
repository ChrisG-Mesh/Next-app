import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';

// middleware necessary otherwise would run into CORS issues when communicating with google ext
const cors = initMiddleware(
  Cors({
    methods: ['POST', 'OPTIONS', 'GET'], 
    origin: '*',
  })
);

async function handler(req, res) {
  await cors(req, res);

  try {
    console.log("In the API call for cataloglink via Next app");
    const response = await fetch(`${process.env.MESH_URL}/api/v1/cataloglink?userId=${process.env.MESH_USERID}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-client-id': process.env.MESH_CLIENTID,
        'x-client-secret': process.env.MESH_APIKEY,
      }
    });

    if (!response.ok) {
      throw new Error('Network response error in API call');
    }

    const data = await response.json();
    const iFrameUrl = data.content.iFrameUrl; // iframeurl retrieved from GET Call

    res.status(200).json({ iFrameUrl });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default handler;
