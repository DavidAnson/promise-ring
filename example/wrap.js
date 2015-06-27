"use strict";

var fs = require("fs");
var pr = require("../promise-ring.js");
var readFile = pr.wrap(fs.readFile);

readFile("../package.json", { "encoding": "utf8" })
  .then(function(data) {
    console.log(JSON.parse(data).name);
  });
