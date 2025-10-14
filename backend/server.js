// backend/server.js (Updated)

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Make sure this is at the top

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Define the chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, model, siteUrl, siteName } = req.body;

        // **MODIFICATION IS HERE**
        // We now read the API key from process.env directly inside the function.
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            // A check to make sure the key was actually loaded
            throw new Error("OPENROUTER_API_KEY not found in .env file");
        }

        if (!messages) {
            return res.status(400).json({ error: 'Messages are required' });
        }

        console.log("Forwarding request to OpenRouter for model:", model);

        const response = await axios.post(
            OPENROUTER_API_URL,
            {
                model: model,
                messages: messages,
            },
            {
                headers: {
                    // Use the apiKey variable read inside this function
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': siteUrl,
                    'X-Title': siteName,
                },
            }
        );

        res.json(response.data);

    } catch (error) {
        console.error('Error calling OpenRouter API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to communicate with the AI model.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`✅ Server is running at http://localhost:${port}`);
});