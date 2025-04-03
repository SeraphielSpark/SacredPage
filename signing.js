const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors())
const PORT = process.env.PORT || 3000;

// Sample user database (for demonstration purposes)
const users = {};

app.use(bodyParser.json());

app.post('/signup', (req, res) => {
    const { username1, password1 } = req.body;

    if (username1 in users) {
        res.json({ success: false, message: 'Username already exists' });
    } else {
        users[username1] = password1;
        res.json({ success: true, message: 'User registered successfully' });
    }
    
});

app.post('/signin', (req, res) => {
    const { username, password } = req.body;

    if (!(username in users) || users[username] !== password) {
        res.json({ success: false, message: 'Invalid credentials' });
    } else {
        res.json({ success: true, message: 'Login successful' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
