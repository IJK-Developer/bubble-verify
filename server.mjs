import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/proxy/admin-api', async (req, res) => {
    const adminApiToken = process.env.SHOPIFY_API_TOKEN;  // Keep sensitive tokens in .env
    const adminEndpoint = 'https://rqnj0i-rt.myshopify.com/admin/api/2025-01/graphql.json';

    try {
        // Log the incoming request for debugging
        console.log('Request Body:', req.body);

        const response = await fetch(adminEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': adminApiToken,
            },
            body: JSON.stringify(req.body),
        });

        // Check for response errors from Shopify Admin API
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Shopify Admin API Error:', errorData);
            return res.status(500).json({ error: 'Error from Shopify Admin API', details: errorData });
        }

        const data = await response.json();
        res.status(200).send(data);
    } catch (error) {
        // Log and return server error
        console.error('Error in Proxy Server:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});
