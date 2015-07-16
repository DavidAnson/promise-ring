"use strict";

var pr = require("../promise-ring.js");
var fsp = pr.wrapAll(require("fs"));
var file = "../package.json";
var encoding = { "encoding": "utf8" };

// Copy a file onto itself using Promises
fsp.stat(file)
  .then(function() {
    return fsp.readFile(file, encoding);
  })
  .then(function(content) {
    return fsp.writeFile(file, content, encoding);
  })
  .then(function() {
    console.log("Copied " + file);
  })
  .catch(console.error);
