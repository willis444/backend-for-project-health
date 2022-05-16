var express = require('express');
var router = express.Router();
require('dotenv').config(); // import the env file
var dbConnection = require('./db');
const authenticateToken = require('../middleware/auth');

router.get('/test', authenticateToken, async function(req, res){
    console.log(req.user);
    res.send("hello there");
 });

//  router.post('/findFood', authenticateToken, async function(req, res){
//     client = await dbConnection.getDb(); //get connection instance
//     db = client.db('Project_Health'); //point to spicific db
//     try {
//         // {'food_name': req.body.food_name}
//     //const result = await db.collection("food").find({ $text: { $search: req.body.food_name } }, {sort: { score: { $meta: "textScore" } }})
//     const result = await db.collection("food").aggregate([
//         {$match: {$text: { $search: req.body.food_name }}}, // match state: find the revelant result using the food name
//         {$limit: 5}, //set limit of the result to 5 only
//         {$project: {"_id":0, "food_name":1}}, // use projection to only return food name from the database
//         {$sort: { score: {$meta: "textScore"} }} // sort the result based on the search similar index
//     ])
//     const data = []; // declare an array
//     await result.forEach(result => 
//         {const obj = {title: result.food_name}; 
//         data.push(obj)}
//         ); 
//     return res.status(200).send(data);
//     } catch (error) {
//         console.log(error);
//     }
// });

router.get('/findFood', async function(req, res){ // special function to handle search request from the front end
        return res.send(null);
    }
);

router.get('/findFood/:query/:language', async function(req, res){ // special function to handle search request from the front end
    if (req.params.query == "") {
        return res.status(200).send(null);
    } else {
        client = await dbConnection.getDb(); //get connection instance
        db = client.db('Project_Health'); //point to spicific db
        try {
            // {'food_name': req.body.food_name}
        //const result = await db.collection("food").find({ $text: { $search: req.body.food_name } }, {sort: { score: { $meta: "textScore" } }})
        const result = await db.collection("food").aggregate([
            {$match: {$text: { $search: req.params.query }}}, // match state: find the revelant result using the food name
            {$limit: 5}, //set limit of the result to 5 only
            {$project: {"_id":1, "food_name":1, "food_alt_name": 1}}, // use projection to only return food name from the database
            {$sort: { score: {$meta: "textScore"} }} // sort the result based on the search similar index
        ])
        const data = []; // declare an array "data"
        if (req.params.language == "ms") { // if the language code is ms, return alternate name
            await result.forEach(result =>  // loop the result array and push the result into the "data" array
            {const obj = {"_id":result._id, "title": result.food_alt_name}; // declare an object and assign the search result to it
            data.push(obj)} // push the object into the data array
            );
        } else { // else, default to return english name
            await result.forEach(result =>  // loop the result array and push the result into the "data" array
            {const obj = {"_id":result._id, "title": result.food_name}; // declare an object and assign the search result to it
            data.push(obj)} // push the object into the data array
            );
        }
        return res.status(200).send(data);
        } catch (error) {
            console.log(error);
        }
    }
});

 router.post('/LogFood', authenticateToken, async function(req, res){
    if (!req.body.datetime || !req.body.meal_type ||!req.body.food_id || !req.body.serving_size) {
        return res.status(422).send('Missing parameters.'); //send error message for missing parameters
    }
    client = await dbConnection.getDb(); //get connection instance
    db = client.db('Project_Health'); //point to spicific db
    // define data structure
    const data = {
        "user_id": req.user.id, // get user id from jwt token
        "log_datetime": req.body.datetime,
        "log_meal_type": req.body.meal_type,
        "log_food_id": req.body.food_id,
        "log_serving_size": req.body.serving_size,
    }
    try {
    const result = await db.collection("log").insertOne(data); // insert data into the db
    return res.status(200).send(result);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;