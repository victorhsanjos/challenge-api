const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

require('./config/database');

app.use(express.json());

app.use('/api', require('./routes/api'));

app.listen(port);

// 404
app.use(function (req, res, next) {
    return res.status(404).json({ message: 'Endpoint' + req.url + ' Not found' });
});

// 500
app.use(function (err, req, res, next) {
    return res.status(500).json({ message: err });
});