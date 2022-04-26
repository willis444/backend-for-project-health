const jwt = require("jsonwebtoken");
require('dotenv').config(); // import the env file
const key = process.env.key; //get private key from the env file

function authenticateToken (req, res, next) {
  const authHeader = req.headers.authorization;
  console.log('hello there');

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, key, (err, user) => {
          if (err) {
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