const mongoClient = require('mongodb').MongoClient;
require('dotenv').config(); // import the env file

const uri = process.env.conString;

let _db;

const initDB = async () => {
  _db = await mongoClient.connect(uri);
  return _db;
}

const getDb = async () => {
  if (!_db) {
    await initDB();
  }
  return _db;
};

module.exports = {
  getDb,
  initDB
};