"use strict";

var fs = require("fs");
var pr = require("../promise-ring");

module.exports = {
  callStatSuccess: function(test) {
    test.expect(3);
    pr.call(fs.stat, "./package.json")
      .then(function(stats) {
        test.ok(stats, "No Stats instance.");
        test.ok(stats instanceof fs.Stats, "Unexpected Stats type.");
        test.ok(stats.isFile(), "Incorrect Stats behavior.");
      })
      .then(test.done, test.done);
  },

  callStatFailure: function(test) {
    test.expect(3);
    pr.call(fs.stat, "./missing.file")
      .then(null, function(err) {
        test.ok(err, "No Error instance.");
        test.ok(err instanceof Error, "Unexpected Error type.");
        test.equal(err.code, "ENOENT", "Incorrect Error code.");
      })
      .then(test.done, test.done);
  }
};
