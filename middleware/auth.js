const jwt = require("jsonwebtoken");
require('dotenv').config(); // import the env file
const key = process.env.key; //get private key from the env file

function authenticateToken (req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1]; // split the token from the incoming request

      jwt.verify(token, key, (err, user) => { // verify the token using jwt
          if (err) { //return error if the token is not correct
              console.log(err);
              return res.sendStatus(403);
          }
          req.user = user;
          next();
      });
  } else {
      res.sendStatus(401);
  }
};

module.exports = authenticateToken;