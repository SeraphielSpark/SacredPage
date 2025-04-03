const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (e.g., HTML, CSS, client-side JavaScript)
//app.use(express.static(path.join(__dirname)));

// Route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'comment1.html'));
});

// Route to handle comment submissions
app.post('/comment', (req, res) => {
    const { name, comment } = req.body;

    // Example: Save the comment to a file
    fs.appendFile('comments.txt', `${name}: ${comment}\n`, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error submitting comment');
        } else {
            console.log('Comment submitted successfully');
            res.status(200).send('Comment submitted successfully');
        }
    });
});

// Route to get comments
app.get('/comments', (req, res) => {
    fs.readFile('comments.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching comments');
        } else {
            res.status(200).send(data);
        }
    });
});
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Initialize an empty object to store usernames, passwords, and images
const userPasswords = {};
const messages = [];
let usernameNow = '';

// Function to register a new user
function registerUser(username, password, image) {
    if (!(username in userPasswords)) {
        userPasswords[username] = { password, image, username };
        return `User ${username} registered successfully.`;
    } else {
        return 'Username already exists. Please choose a different username.';
    }
}

// Function to check if a user exists and validate the password
function checkCredentials(username, password) {
    if (userPasswords[username] && userPasswords[username].password === password) {
        return true;
    }
    return false;
}

// Route to handle user registration
app.post('/register', (req, res) => {
    const { username, password, image } = req.body;
    const message = registerUser(username, password, image);
    res.json({ message });
});
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Set the destination folder for uploaded files

app.post('/get_data', upload.single('file'), (req, res) => {
    const image = req.file.path; // Get the path of the uploaded file
    const { username, password } = req.body;

    const message = registerUser(username, password, image);
    console.log(userPasswords[username]);
    console.log(userPasswords[username].password);
    res.json({ message: 'Form Received' });
});

// Route to handle user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const isAuthenticated = checkCredentials(username, password);
    if (isAuthenticated) {
        usernameNow = username;
    }
    res.json({ isAuthenticated });
});

// Route to get the current username
app.get('/username', (req, res) => {
    res.json({ usernameNow });
});

// Route to get user data
app.get('/get', (req, res) => {
    res.json({ userPasswords });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
