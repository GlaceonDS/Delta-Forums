const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let posts = [];

app.get('/posts', (req, res) => {
    res.json(posts);
});

app.post('/posts', (req, res) => {
    const post = req.body;
    posts.push(post);
    res.status(201).json(post);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
