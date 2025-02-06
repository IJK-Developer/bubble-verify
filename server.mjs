import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from a .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Use PORT from environment or default to 3000

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON requests

// Proxy endpoint for Shopify Admin API
app.post("/proxy/admin-api", async (req, res) => {
    const adminApiToken = process.env.ADMIN_API_TOKEN; // Use environment variable for API token
    const adminEndpoint = "https://rqnj0i-rt.myshopify.com/admin/api/2025-01/graphql.json";

    if (!adminApiToken) {
        return res.status(500).send({ error: "Admin API token is not configured in environment variables." });
    }

    try {
        // Forward the request to Shopify Admin API
        const response = await fetch(adminEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": adminApiToken,
            },
            body: JSON.stringify(req.body),
        });

        // Handle non-200 responses from Shopify
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).send({
                error: errorData.errors || "Unknown error occurred.",
            });
        }

        // Return successful response from Shopify
        const data = await response.json();
        res.status(200).send(data);
    } catch (error) {
        console.error("Error occurred while processing the request:", error);
        res.status(500).send({ error: error.message || "Internal Server Error" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});
