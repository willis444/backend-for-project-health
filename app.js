// uncomment this to export the app
//const serverless = require('serverless-http');
const {MongoClient} = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();
var router = require('./routes.js');

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

app.use('/routes', router);

//uncomment this to export the app
//module.exports.handler = serverless(app);
app.listen(3000);