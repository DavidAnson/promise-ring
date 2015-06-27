"use strict";

// A simple harness to run all examples

var fs = require("fs");
var pr = require("../promise-ring.js");

pr.call(fs.readdir, ".")
  .then(function(files) {
    files.forEach(function(file) {
      require("./" + file);
    });
  });
