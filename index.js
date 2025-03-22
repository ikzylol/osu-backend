// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000; // Using PORT from the environment variable

// API endpoint to get osu! rank information
app.get("/api/osu-rank", async (req, res) => {
    try {
        // Use environment variables for CLIENT_ID and CLIENT_SECRET
        const tokenResponse = await axios.post("https://osu.ppy.sh/oauth/token", {
            client_id: process.env.CLIENT_ID,  // Access CLIENT_ID from .env
            client_secret: process.env.CLIENT_SECRET,  // Access CLIENT_SECRET from .env
            grant_type: "client_credentials",
            scope: "public"
        });

        const accessToken = tokenResponse.data.access_token;
        const userId = "22484273"; // Replace with your osu! username or ID

        // Get osu! user information
        const userResponse = await axios.get(`https://osu.ppy.sh/api/v2/users/${userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        // Respond with osu! rank data
        res.json({
            global_rank: userResponse.data.statistics.global_rank,
            country_rank: userResponse.data.statistics.country_rank
        });
    } catch (error) {
        console.error("Error fetching osu! rank:", error);
        res.status(500).json({ error: "Failed to fetch osu! rank" });
    }
});

// Start the server on the specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
