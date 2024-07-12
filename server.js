const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let posts = [];

// Fetch all posts
app.get('/posts', (req, res) => {
    res.json(posts);
});

// Add a new post
app.post('/posts', (req, res) => {
    const post = req.body;
    posts.push(post);
    res.status(201).json(post);
});

// Delete a post
app.delete('/posts/:title', (req, res) => {
    const title = req.params.title;
    posts = posts.filter(post => post.title !== title);
    res.status(204).send();
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
