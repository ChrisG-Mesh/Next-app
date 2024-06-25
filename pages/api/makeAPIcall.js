import { createLink } from '@meshconnect/web-link-sdk';

export default async function handler(req, res) {
    // MESH_URL=https://sandbox-integration-api.meshconnect.com
    // const apiUrl = 'https://sandbox-integration-api.meshconnect.com/api/v1/linktoken'
    // const apiUrl = 'https://mesh-transactions-dev-api.azurewebsites.net/api/transactions';

    try {
        console.log("in the api call for linktoken")
        const response = await fetch(`${process.env.MESH_URL}/api/v1/linktoken`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-client-id': process.env.MESH_CLIENTID,
                'x-client-secret':process.env.MESH_APIKEY,
              },
              body: JSON.stringify({
                userId: process.env.MESH_USERID,
              }),
            });
        
        
        if (!response) {
            throw new Error('Network response error API call');
        }

        const data = await response.json();
        const linkToken = data.content.linkToken;

        // testing link here
        const link = createLink({
            clientId: process.env.MESH_CLIENTID,
            onIntegrationConnected: (data) => {
                console.log('Integration connected:', data);
            },
            onExit: (error) => {
                if (error) {
                    console.error('Link exited with error:', error);
                } else {
                    console.log('Link exited successfully');
                }
            }
        });
        // Call openLink with linkToken
        console.log(link)
        // link.openLink(linkToken);
        // done testing link
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
