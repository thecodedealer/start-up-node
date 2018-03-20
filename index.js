var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var config = require('./config');

//Connect to database
// mongoose.connect('mongodb://<user>:<pass>@ds259258.mlab.com:59258/lotomania');

//instantiate express
var app = express();
//App Settings
app.set('port', (process.env.PORT || 5000));


//Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

//Set header
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With, Content-Type, Accept, authorization");
    res.header("Access-Control-Allow-Methods", ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE']);
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});


//Get index page
app.get('/', function (req, res) {
    res.render('index.html')
});


app.listen(app.get('port'), function() {
    console.log('Node App is running on port', app.get('port'));
});


