"use strict";

var Database = require("./database.js");
var db = new Database("MockDB");
var pr = require("../promise-ring.js");

pr.applyBound(db, db.query, [ "promise-ring" ])
  .then(function(result) {
    console.log(result);
  });
