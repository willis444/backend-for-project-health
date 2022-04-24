var express = require('express');
var router = express.Router();
var dbConnection = require('./db');
const bcrypt = require('bcryptjs');
const saltRounds = 10; // by default 10 is used

router.post('/login', async function(req, res, err){
    client = await dbConnection.getDb(); //get connection instance
    db = client.db('Project_Health'); //point to spicific db
    if(!req.body.id || !req.body.password){ // input validation
        return res.status(422).send('Missing parameters. The required parameters are id and password.'); //send error message for missing parameters
    }
    await db.collection("user").findOne({'ID': req.body.id}, function(err, result) { //find the data from the database
        if (err) throw err;
        return res.send(result);
      });
});

router.post('/register', async function(req, res){
    client = await dbConnection.getDb(); //get connection instance
    if(!req.body.id || !req.body.password){ // input validation
        return res.status(422).send('Missing parameters. The required parameters are id and password.'); //send error message for missing parameters
    }
    db = client.db('Project_Health'); //point to spicific db
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, async function(err, hash) {
            var data = { // define the databody
                "ID": req.body.id,
                "Password": hash,
            }
            await db.collection('user').insertOne(data); //insert the data into the database
            return res.send('acknowleged!');
        });
    });
});

//export this router to use in our index.js
module.exports = router;