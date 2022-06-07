const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();


// Routers
const pingRouter = require('./routes/ping.js');
const postRouter = require('./routes/post.js');

// Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/ping', pingRouter);
app.use('/api/posts', postRouter);


const PORT = process.env.PORT || 2222;

app.listen(PORT, () => {
    console.log(`Server running on : http://localhost:${PORT}`);
})

