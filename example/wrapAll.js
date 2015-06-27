"use strict";

var fs = require("fs");
var Database = require("./database.js");
var db = new Database("MockDB");
var pr = require("../promise-ring.js");
var fsw = pr.wrapAll(fs);
var dbw = pr.wrapAll(db);

fsw.readFile("../package.json", { "encoding": "utf8" })
  .then(function(data) {
    console.log(JSON.parse(data).name);
  });

dbw.query("promise-ring")
  .then(function(result) {
    console.log(result);
  });
