var express = require('express');
var router = express.Router();
var dbConnection = require('./db');

router.post('/test', async function(req, res){
    res.send(req.body);
 });

module.exports = router;