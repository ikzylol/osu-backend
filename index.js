const express = require("express");
const cors = require("cors"); // Import cors
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

app.get("/api/osu-rank", async (req, res) => {
    try {
        const tokenResponse = await axios.post("https://osu.ppy.sh/oauth/token", {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "client_credentials",
            scope: "public"
        });

        const accessToken = tokenResponse.data.access_token;
        const userId = "22484273"; // Replace with your osu! username or ID

        const userResponse = await axios.get(`https://osu.ppy.sh/api/v2/users/${userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        res.json({
            global_rank: userResponse.data.statistics.global_rank,
            country_rank: userResponse.data.statistics.country_rank
        });
    } catch (error) {
        console.error("Error fetching osu! rank:", error);
        res.status(500).json({ error: "Failed to fetch osu! rank" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
