"use strict";

var fs = require("fs");
var pr = require("../promise-ring.js");

pr.apply(fs.readFile, [ "../package.json", { "encoding": "utf8" } ])
  .then(function(data) {
    console.log(JSON.parse(data).name);
  });
