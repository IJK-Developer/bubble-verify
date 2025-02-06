import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Enable CORS

app.post('/proxy/admin-api', async (req, res) => {
    const adminApiToken = process.env.SHOPIFY_API_TOKEN; // Use environment variable
    const adminEndpoint = process.env.SHOPIFY_STORE_URL; // Use environment variable

    try {
        const response = await fetch(adminEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': adminApiToken,
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        res.status(200).send(data); // Respond with data from Shopify API
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});
