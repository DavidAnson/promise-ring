"use strict";

var fs = require("fs");
var pr = require("../promise-ring");

function throwFn() {
  throw new Error("throwFn");
}

function Class() {
  this.value = 1;
}
Class.prototype.add = function(arg, cb) {
  cb(null, this.value + arg);
};
Class.prototype.fail = function() {
  throw new Error("Class.fail " + this.value);
}

module.exports = {
  callStatSuccess: function(test) {
    test.expect(2);
    pr.call(fs.stat, "./package.json")
      .then(function(stats) {
        test.ok(stats instanceof fs.Stats, "Unexpected Stats type.");
        test.ok(stats.isFile(), "Incorrect Stats behavior.");
      })
      .then(test.done, test.done);
  },

  callStatFailure: function(test) {
    test.expect(2);
    pr.call(fs.stat, "./missing.file")
      .then(null, function(err) {
        test.ok(err instanceof Error, "Unexpected Error type.");
        test.equal(err.code, "ENOENT", "Incorrect Error code.");
      })
      .then(test.done, test.done);
  },

  callThrowFn: function(test) {
    test.expect(2);
    pr.call(throwFn)
      .catch(function(err) {
        test.ok(err instanceof Error, "Unexpected Error type.");
        test.equal(err.message, "throwFn", "Incorrect Error message.");
      })
      .then(test.done, test.done);
  },

  applyStatSuccess: function(test) {
    test.expect(2);
    pr.apply(fs.stat, ["./package.json"])
      .then(function(stats) {
        test.ok(stats instanceof fs.Stats, "Unexpected Stats type.");
        test.ok(stats.isFile(), "Incorrect Stats behavior.");
      })
      .then(test.done, test.done);
  },

  applyStatFailure: function(test) {
    test.expect(2);
    pr.apply(fs.stat, ["./missing.file"])
      .then(null, function(err) {
        test.ok(err instanceof Error, "Unexpected Error type.");
        test.equal(err.code, "ENOENT", "Incorrect Error code.");
      })
      .then(test.done, test.done);
  },

  applyThrowFn: function(test) {
    test.expect(2);
    pr.apply(throwFn)
      .catch(function(err) {
        test.ok(err instanceof Error, "Unexpected Error type.");
        test.equal(err.message, "throwFn", "Incorrect Error message.");
      })
      .then(test.done, test.done);
  },

  callBoundSuccess: function(test) {
    test.expect(1);
    var cls = new Class();
    pr.callBound(cls, cls.add, 2)
      .then(function(result) {
        test.equal(result, 3, "Context lost.")
      })
      .then(test.done, test.done);
  },

  callBoundFailure: function(test) {
    test.expect(2);
    var cls = new Class();
    pr.callBound(cls, cls.fail)
      .catch(function(err) {
        test.ok(err instanceof Error, "Unexpected Error type.");
        test.equal(err.message, "Class.fail 1", "Incorrect Error message.");
      })
      .then(test.done, test.done);
  },

  applyBoundSuccess: function(test) {
    test.expect(1);
    var cls = new Class();
    pr.applyBound(cls, cls.add, [3])
      .then(function(result) {
        test.equal(result, 4, "Context lost.")
      })
      .then(test.done, test.done);
  },

  applyBoundFailure: function(test) {
    test.expect(2);
    var cls = new Class();
    pr.applyBound(cls, cls.fail)
      .catch(function(err) {
        test.ok(err instanceof Error, "Unexpected Error type.");
        test.equal(err.message, "Class.fail 1", "Incorrect Error message.");
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
