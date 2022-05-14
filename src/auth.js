var express = require('express');
var router = express.Router();
var dbConnection = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10; // by default 10 is used
require('dotenv').config(); // import the env file
const key = process.env.key; //get private key from the env file

router.post('/login', async function(req, res, err){
    client = await dbConnection.getDb(); //get connection instance
    db = client.db('Project_Health'); //point to spicific db
    if(!req.body.user_id || !req.body.user_password){ // input validation
        return res.status(422).send('Missing parameters. The required parameters are id and password.'); //send error message for missing parameters
    }

    result = await db.collection("user").findOne({'_id': req.body.user_id}, function(err, result) { //find the data from the database
        if (err) throw err;
        if (!result) {
            return res.status(401).send('This id is not associated with any account.');
        } else {
                bcrypt.compare(req.body.user_password, result.user_password, function(err, compare_result) { //check if the password inputted by user is the same as the password stored in db
                    if (compare_result === true) { // if it is true, return true
                        jwt.sign( {id: result._id} , key, { algorithm: 'HS256', expiresIn: '7d' }, async function(err, token) { //sign the user id using jwt token
                            if (err) throw err;
                            return res.status(200).send({'token': token});
                          });
                    } else if (compare_result === false) { //if the password is wrong, send error message
                        return res.status(403).send("Wrong password");
                    } else {
                        return res.status(500).send("Server error, please try again later");
                    }
                });
            }
      });
});

router.post('/register', async function(req, res){
    try {
        client = await dbConnection.getDb(); //get connection instance
        if(!req.body.user_id || !req.body.user_password){ // input validation
            return res.status(422).send('Missing parameters. The required parameters are id and password.'); //send error message for missing parameters
        } else {
            db = client.db('Project_Health'); //point to spicific db
            response = await db.collection("user").findOne({'_id': req.body.user_id});
            if (response) {
                return res.status('409').send('Duplicated ID. Please choose another ID.');
            } else{
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(req.body.user_password, salt, async function(err, hash) {
                        var data = { // define the databody
                            "_id": req.body.user_id,
                            "user_password": hash,
                            "user_role": "user",
                            "user_eating_habits": {
                                "isPork": false,
                                "isBeef": false,
                                "isVegetarian": false,
                                "isSeafood": false
                            }
                        }
                        await db.collection('user').insertOne(data); //insert the data into the database
                        return res.status(200).send('Register Successful');
                    });
                });
            }
        }
    } catch (error) {
        console.log({"ERROR": error})
    }
});

//export this router to use in our index.js
module.exports = router;