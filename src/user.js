var express = require('express');
var router = express.Router();
require('dotenv').config(); // import the env file
var dbConnection = require('./db');
const authenticateToken = require('../middleware/auth');

router.get('/test', authenticateToken, async function(req, res){
    console.log(req.user);
    res.send("hello there");
 });

router.get('/test1', async function(req, res){
res.send("hello there");
});

module.exports = router;