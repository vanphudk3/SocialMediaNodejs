const express = require('express');
const { StreamChat } = require('stream-chat');
const cors = require('cors');
const app = express();
// no cors needed for this example
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});