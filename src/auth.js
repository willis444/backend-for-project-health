var express = require('express');
var router = express.Router();
var dbConnection = require('./db');

router.get('/test', function(req, res){
    console.log(req.body);
    res.send("recieved your request!");
 });

router.post('/login', async function(req, res){
    db = await dbConnection.Get();
    result = await db.collection('user').find({'user': req.id});
    console.log(result);
});

//export this router to use in our index.js
module.exports = router;