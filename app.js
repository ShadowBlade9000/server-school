const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/school', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Define schema
const postSchema = new mongoose.Schema({
  content: String,
});


const Post = mongoose.model('Post', postSchema);

// Enable CORS
app.use(cors());

// Parse request body
app.use(express.json());

// API routes
app.post('/api/post/create', async (req, res) => {
  const {content} = req.body;

  try {
    const newPost = new Post({content});
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create post' });
  }
});
app.get('/api/post/list', async (req, res) => {
  try {
    const collection = db.collection('posts'); // Replace with your own collection name
    const documents = await collection.find({}).toArray();
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});