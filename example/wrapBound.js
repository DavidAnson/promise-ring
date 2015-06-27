"use strict";

var Database = require("./database.js");
var db = new Database("MockDB");
var pr = require("../promise-ring.js");
var dbquery = pr.wrapBound(db, db.query);

dbquery("promise-ring")
  .then(function(result) {
    console.log(result);
  });
