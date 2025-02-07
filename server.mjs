import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Shopify Admin API Proxy Endpoint
app.post("/proxy/admin-api", async (req, res) => {
    const adminApiToken = "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"; // Replace with your token
    const adminEndpoint = "https://rqnj0i-rt.myshopify.com/admin/api/2025-01/graphql.json";

    try {
        // Forward the GraphQL query to the Shopify Admin API
        const response = await fetch(adminEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": adminApiToken, // Admin API token
            },
            body: JSON.stringify(req.body), // Pass the request body directly
        });

        const data = await response.json();

        // If Shopify API responds with an error
        if (!response.ok) {
            return res.status(response.status).json({ error: data });
        }

        res.status(200).json(data); // Respond with data from Shopify API
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to Shopify Admin API" });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});
