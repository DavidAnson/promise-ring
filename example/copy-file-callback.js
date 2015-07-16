"use strict";

var fs = require("fs");
var file = "../package.json";
var encoding = { "encoding": "utf8" };

// Copy a file onto itself using callbacks
fs.stat(file, function(err) {
  if (err) {
    console.error(err);
  } else {
    fs.readFile(file, encoding, function(errr, content) {
      if (errr) {
        console.error(errr);
      } else {
        fs.writeFile(file, content, encoding, function(errrr) {
          if (errrr) {
            console.error(errrr);
          } else {
            console.log("Copied " + file);
          }
        });
      }
    });
  }
});
