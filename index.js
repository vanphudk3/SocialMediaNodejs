require('dotenv').config()
const express = require('express');
const { StreamChat } = require('stream-chat');
const cors = require('cors');
const app = express();
const nodemailer = require("nodemailer");
// no cors needed for this example
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const transporter = nodemailer.createTransport({
  service: "Gmail", // hoặc dịch vụ email khác
  auth: {
    user: process.env.NAMEMAIL, // email của bạn
    pass: process.env.PASSMAIL, // mật khẩu email của bạn
  },
});

app.use(cors());


const port = 3000;

// Replace with your actual API key and secret
const apiKey = '5dtq65792mxr';
const apiSecret = 'ayabvrzh6p7nfnrn67pnu6e93zb6bvdjhusz557u7mmrqyhcb3mxxapmg5254m4n';

const serverSideClient = StreamChat.getInstance(apiKey, apiSecret);

app.get('/generate-token', (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).send('User ID is required');
  }
  const token = serverSideClient.createToken(userId);
  res.send({ token });
});

app.post("/sendMail", async (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: process.env.NAMEMAIL,
    to,
    subject,
    html: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('success');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    console.error("Error account email:", process.env.NAMEMAIL);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/sendMails", async (req, res) => {
  const { recipients, subject, text } = req.body;

  if (!Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ success: false, error: "Invalid recipients list" });
  }

  const mailOptions = {
    from: process.env.NAMEMAIL,
    to: recipients.join(", "), // Join all recipients with a comma
    subject,
    html: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to multiple recipients");
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});