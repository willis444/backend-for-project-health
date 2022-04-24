var express = require('express');
var router = express.Router();
var dbConnection = require('./db');

router.post('/test', async function(req, res){
    res.send(req.body);
 });

 router.get('/test1', async function(req, res){
    console.log(req.body);
    res.send("niama cibai, this is test 1");
 });

router.post('/login', async function(req, res, err){
    client = await dbConnection.getDb(); //get db instance
    db = client.db('Project_Health'); //get the specific database
    if(!req.body.id || !req.body.password){ // input validation
        return res.status(422).send('Missing parameters. The required parameters are id and password.'); //send error message for missing parameters
    }
    await db.collection("user").findOne({'ID': req.body.id}, function(err, result) { //find the data from the database
        if (err) throw err;
        return res.send(result);
      });
});

router.post('/register', async function(req, res){
    client = await dbConnection.getDb(); //get db instance
    var data = {
        "ID": req.body.id,
        "Password": req.body.password,
    };
    db = client.db('Project_Health');
    await db.collection('user').insert
    result = await db.collection('user').insertOne(data);
    res.send('acknowleged!');
});

//export this router to use in our index.js
module.exports = router;