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

router.get('/getProfile', authenticateToken, async function(req, res){
    client = await dbConnection.getDb(); //get connection instance
    db = client.db('Project_Health'); //point to spicific db
    result = await db.collection("user").findOne({'_id': req.user.id}, function(err, result) { //find the data from the database using the id in the jwt token
        if (err) {
            return res.status(500).send(err.message);
        } else {
            var data = { // define the databody
                "_id": result._id,
                "user_role": result.user_role,
                "user_eating_habits": {
                    "isPork": result.user_eating_habits.isPork,
                    "isBeef": result.user_eating_habits.isBeef,
                    "isVegetarian": result.user_eating_habits.isVegetarian,
                    "isSeafood": result.user_eating_habits.isSeafood
                }
            }
            return res.status(200).send(data); // return data to the api
        }
    });
});

router.post('/updateProfile', authenticateToken, async function(req, res){
    if (!req.body.isPork || !req.body.isBeef || !req.body.isVegetarian || !req.body.isSeafood) {
        return res.status(422).send("Missing Parameters, please check the parameters you send");
    } else {
        user_eating_habits = { // ternary operator is used as urlencoded only returns string
                "isPork": req.body.isPork=="true"?true:false,
                "isBeef": req.body.isBeef=="true"?true:false,
                "isVegetarian": req.body.isVegetarian=="true"?true:false,
                "isSeafood": req.body.isSeafood=="true"?true:false,
                }
        client = await dbConnection.getDb(); //get connection instance
        db = client.db('Project_Health'); //point to spicific db
        result = await db.collection("user").updateOne({'_id': req.user.id}, {$set:{user_eating_habits}}, function(err, result) { //find the data from the database using the id in the jwt token
            if (err) {
                return res.status(500).send(err.message);
            } else {
                return res.status(200).send(result); // return data to the api
            }
        });
    }
});

module.exports = router;