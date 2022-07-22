// Connecting to DB
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/AddressBook',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection
        .once('open', ()=>console.log('connected to database'))
        .on('error',(error)=>console.log("connection to database failed!!",error));

module. exports = mongoose;

