var express = require('express');
var router = express.Router();

module.exports = function(app) {
    app.use("/auth", require("./auth"));
    app.use("/user", require("./user"));
    app.use("/food", require("./food"));
}