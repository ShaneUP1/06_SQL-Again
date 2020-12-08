const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    console.log(req.body);
    res.send('Hello world');
});


module.exports = app;
