const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Address = require('./model/models')


//Initialize express app
const app = express();

const adressRoute = require('./routes/address');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(adressRoute);


// Connecting to DB
mongoose.connect('mongodb://localhost:27017/AddressBook',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection
        .once('open', ()=>console.log('connected to database'))
        .on('error',(error)=>console.log("connection to database failed!!",error))

// Initialize the sever
app.listen(3000, () => {
    console.log('sever listening on port:3000');
});
