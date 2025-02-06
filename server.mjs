import express from "express";
import fetch from "node-fetch";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/proxy/admin-api", async (req, res) => {
    const adminApiToken = "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";
    const adminEndpoint = "https://rqnj0i-rt.myshopify.com/admin/api/2025-01/graphql.json";

    try {
        const response = await fetch(adminEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": adminApiToken,
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});
