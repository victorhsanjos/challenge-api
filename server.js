const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

require('./config/database');

app.use(express.json());

app.use('/api', require('./routes/api'));

app.listen(port);