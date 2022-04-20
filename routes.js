var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.send("Niama Cibai, you are in the wrong route");
 });

router.get('/hello', function(req, res){
    res.send("hello there, i am updated!");
 });

router.post('/form', function(req, res){
    console.log(req.body);
    res.send("recieved your request!");
 });

//export this router to use in our index.js
module.exports = router;