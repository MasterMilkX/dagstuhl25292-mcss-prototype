const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('front-end'));
app.use('/images', express.static('images'));

let vectorEmbeds = {};
let gameVectors = {};

try {
    const data = fs.readFileSync(path.join(__dirname, 'vector_embed.json'), 'utf8');
    vectorEmbeds = JSON.parse(data);
} catch (err) {
    console.error('Error loading vector_embed.json:', err);
}

try {
    const gameData = fs.readFileSync(path.join(__dirname, 'game_vecs.json'), 'utf8');
    const parsedGameData = JSON.parse(gameData);
    // Extract vectors from game data for nearest neighbor calculations
    gameVectors = Object.fromEntries(
        Object.entries(parsedGameData).map(([id, game]) => [id, game.vector])
    );
} catch (err) {
    console.error('Error loading game_vecs.json:', err);
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front-end', 'index.html'));
});

// API endpoint to get image filenames
app.get('/api/images', (req, res) => {
    try {
        const gameVecsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'game_vecs.json'), 'utf8'));
        res.json(gameVecsData);
    } catch (error) {
        console.error('Error reading game_vecs.json:', error);
        res.status(500).json({ error: 'Failed to load game data' });
    }
});

// API endpoint for getting 9 nearest neighbours based on vectors [256]
app.get('/api/nearest-neighbors', (req, res) => {
    const queryVector = gameVectors[req.query.id];
    if (!queryVector) {
        return res.status(400).json({ error: 'Invalid or missing id' });
    }

    function euclideanDistance(a, b) {
        return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
    }

    const k = 9;
    const distances = Object.entries(gameVectors)
        .filter(([key]) => key !== req.query.id)
        .map(([key, vector]) => ({
            id: key,
            distance: euclideanDistance(queryVector, vector)
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, k);

    res.json(distances);
});

// Export app for testing
module.exports = app;

// Start server only if not in test environment
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}