import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded from .env file

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/proxy/admin-api', async (req, res) => {
    const adminApiToken = process.env.SHOPIFY_API_TOKEN; // Make sure your .env has the correct token
    const adminEndpoint = 'https://rqnj0i-rt.myshopify.com/admin/api/2025-01/graphql.json'; // Update with your store's domain

    console.log('Received request body:', req.body);

    try {
        const response = await fetch(adminEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': adminApiToken,
            },
            body: JSON.stringify(req.body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Shopify Admin API Error:', errorData);
            return res.status(500).json({ error: 'Error from Shopify Admin API', details: errorData });
        }

        const data = await response.json();
        res.status(200).send(data);
    } catch (error) {
        console.error('Proxy Server Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});
