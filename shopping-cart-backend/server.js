const config = require('./config.js');
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const mongoose = require('mongoose');
const products  = require('./routes/products.route');
const users = require('./routes/users.route');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use('/users', users);
app.use('/products', products);
app.use(cors());
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
 });

mongoose
    .connect(config.mongoURL)
    .then(console.log("Database connected."))
    .catch(err => console.log(err));

mongoose.Promise = global.Promise;

let db = mongoose.connection;

db.on("error", console.error.bind(console, 'Connection Error'))

app.listen(config.serverPort, function(){
    console.log(`Server is running on port ${config.serverPort}...`)
})