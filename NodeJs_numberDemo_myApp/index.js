const express = require('express')
const bodyParser = require('body-parser')

//Initialize express app
const app = express();

// Routes
const numberRoute = require('./routes/number');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(numberRoute);

// Initialize the sever
app.listen(3000, () => {
    console.log('sever listening on port:3000');
});

