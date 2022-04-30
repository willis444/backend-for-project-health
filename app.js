const serverless = require('serverless-http');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();
const db = require('./src/db');

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

require("./src/routes.js")(app); // get the routes from routes.js

db.initDB();

//uncomment this to run it locally
app.listen(3000);

//uncomment this to export the app
//module.exports.handler = serverless(app);