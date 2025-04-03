const express = require('express');
const app = express();
const message = [];
const cors = require('cors')
app.use(cors())
app.use(express.json());
function setCookie(name, value, daysToExpire) {
  const date = new Date();
  date.setTime(date.getTime() + daysToExpire  24  60  60  1000);
  const expires = 'expires=' + date.toUTCString();
  document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

// Function to get a cookie by name
function getCookie(name) {
  const cookieName = name + '=';
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return '';
}
setCookie('message', message, 7)
const messages = getCookie('message')
app.post('/send', (req, res) => {
  const { message } = req.body;
  messages.push({ text: message, timestamp: new Date() });
  res.status(200).json({ message: 'Message sent successfully' });
});

app.get('/messages', (req, res) => {
  res.json(messages);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
