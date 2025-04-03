const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up a route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'video_auto_play.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
