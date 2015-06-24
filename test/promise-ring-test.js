"use strict";

var fs = require("fs");
var pr = require("../promise-ring");

function throwFn() {
  throw new Error("throwFn");
}

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
  },

  callThrowFn: function(test) {
    test.expect(3);
    pr.call(throwFn)
      .catch(function(err) {
          test.ok(err, "No Error instance.");
          test.ok(err instanceof Error, "Unexpected Error type.");
          test.equal(err.message, "throwFn", "Incorrect Error message.");
        })
      .then(test.done, test.done);
  },

  applyStatSuccess: function(test) {
    test.expect(3);
    pr.apply(fs.stat, ["./package.json"])
      .then(function(stats) {
        test.ok(stats, "No Stats instance.");
        test.ok(stats instanceof fs.Stats, "Unexpected Stats type.");
        test.ok(stats.isFile(), "Incorrect Stats behavior.");
      })
      .then(test.done, test.done);
  },

  applyStatFailure: function(test) {
    test.expect(3);
    pr.apply(fs.stat, ["./missing.file"])
      .then(null, function(err) {
        test.ok(err, "No Error instance.");
        test.ok(err instanceof Error, "Unexpected Error type.");
        test.equal(err.code, "ENOENT", "Incorrect Error code.");
      })
      .then(test.done, test.done);
  },

  applyThrowFn: function(test) {
    test.expect(3);
    pr.apply(throwFn)
      .catch(function(err) {
          test.ok(err, "No Error instance.");
          test.ok(err instanceof Error, "Unexpected Error type.");
          test.equal(err.message, "throwFn", "Incorrect Error message.");
        })
      .then(test.done, test.done);
  },

  argsNotModified: function(test) {
    test.expect(1);
    var originalArgs = ["./package.json"];
    var args = originalArgs.slice();
    pr.apply(fs.stat, args)
      .then(function(stats) {
        test.deepEqual(args, originalArgs, "Arguments array modified.");
      })
      .then(test.done, test.done);
  }
};
