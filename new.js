const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'etaiwo220@gmail.com',
    pass: 'imnddpgnwzfayhwn', // Generate this from your Gmail settings
  },
});

function generateRandomCode() {
  return Math.random().toString(36).substring(2, 8);
}
app.post('/signupnow2', async (req, res) => {
  const { email, username } = req.body;
  const randomCode = generateRandomCode(); // Generate a random verification code

  try {
    const response = await transporter.sendMail({
      from: 'etaiwo220@gmail.com',
      to: email,
      subject: 'Welcome to Our Website',
      html: `<p>Hello ${username}, welcome to our website!</p><p>Your Code is <a href="https://yourwebsite.com/verify?code=${randomCode}">${randomCode}</a></p>`,
    });

    console.log(response);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending email' });
  }
});
app.post('/signupnow2', async (req, res) => {
  const { email, username } = req.body;
  const randomCode = generateRandomCode(); // Generate a random verification code

  try {
    const response = await transporter.sendMail({
      from: 'etaiwo220@gmail.com',
      to: email,
      subject: 'Welcome to Our Website',
      html: `<p>Hello ${username}, welcome to our website!</p><p>Your Code is <a href="https://yourwebsite.com/verify?code=${randomCode}">${randomCode}</a></p>`,
    });

    console.log(response);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending email' });
  }
});
app.post('/signupnow2', async (req, res) => {
  const { email, username } = req.body;
  const randomCode = generateRandomCode(); // Generate a random verification code

  try {
    const response = await transporter.sendMail({
      from: 'etaiwo220@gmail.com',
      to: email,
      subject: 'Welcome to Our Website',
      html: `<p>Hello ${username}, welcome to our website!</p><p>Your Code is <a href="https://yourwebsite.com/verify?code=${randomCode}">${randomCode}</a></p>`,
    });

    console.log(response);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending email' });
  }
});
