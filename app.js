const express = require('express');
const app = express();
const path = require('path');

// Serve static files (HTML, CSS, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Process form submissions
app.post('/process', express.urlencoded({ extended: true }), (req, res) => {
    const input_data = req.body.input_data;
    let result = '';
    if (input_data === 'correct') {
        result = 'correct';
    } else {
        result = 'wrong';
    }

    res.redirect(`/${result}`);
});

app.get('/correct', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'astrology.html'));
});

app.get('/wrong', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tts.htm l'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
