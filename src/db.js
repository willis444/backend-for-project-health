var MongoClient = require('mongodb').MongoClient;

var dbConnection = function () {

    var db = null;
    var instance = 0;

    async function dbConnect() {
        try {
            // connection string
            const uri = 'mongodb+srv://willis444:CYtj392h2as7fcQk@cluster0.joxdx.mongodb.net/Project_Health?retryWrites=true&w=majority';
            let db = await MongoClient.connect(uri);
            db = db.db('Project_Health');
            return db
        } catch (e) {
            return e;
        }
    }

   async function Get() {
        try {
            instance++;     // this is just to count how many times our singleton is called.
            console.log(`DbConnection called ${instance} times`);

            if (db != null) {
                console.log(`db connection is already alive`);
                return db;
            } else {
                console.log(`getting new db connection`);
                db = await dbConnect();
                return db; 
            }
        } catch (e) {
            return e;
        }
    }

    return {
        Get: Get
    }
}

module.exports = dbConnection();