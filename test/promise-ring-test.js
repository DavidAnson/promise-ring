"use strict";

var fs = require("fs");
var pr = require("../promise-ring");

var goodFile = "./package.json";
var badFile = "./missing.file";

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
  callSuccess: function(test) {
    test.expect(2);
    pr.call(fs.stat, goodFile)
      .then(function(stats) {
        test.ok(stats instanceof fs.Stats, "Unexpected Stats type.");
        test.ok(stats.isFile(), "Incorrect Stats behavior.");
      })
      .then(test.done, test.done);
  },

  callFailure: function(test) {
    test.expect(2);
    pr.call(fs.stat, badFile)
      .catch(function(err) {
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

  applySuccess: function(test) {
    test.expect(2);
    pr.apply(fs.stat, [goodFile])
      .then(function(stats) {
        test.ok(stats instanceof fs.Stats, "Unexpected Stats type.");
        test.ok(stats.isFile(), "Incorrect Stats behavior.");
      })
      .then(test.done, test.done);
  },

  applyFailure: function(test) {
    test.expect(2);
    pr.apply(fs.stat, [badFile])
      .catch(function(err) {
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

  wrapSuccess: function(test) {
    test.expect(3);
    var stat = pr.wrap(fs.stat);
    stat(goodFile)
      .then(function(stats) {
        test.ok(stats instanceof fs.Stats, "Unexpected Stats type.");
        test.ok(stats.isFile(), "Incorrect Stats behavior.");
        return stat(goodFile);
      })
      .then(function(stats) {
        test.ok(stats instanceof fs.Stats, "Unexpected Stats type.");
      })
      .then(test.done, test.done);
  },

  wrapFailure: function(test) {
    test.expect(3);
    var stat = pr.wrap(fs.stat);
    stat(badFile)
      .catch(function(err) {
        test.ok(err instanceof Error, "Unexpected Error type.");
        test.equal(err.code, "ENOENT", "Incorrect Error code.");
        return stat(badFile);
      })
      .catch(function(err) {
        test.ok(err instanceof Error, "Unexpected Error type.");
      })
      .then(test.done, test.done);
  },

  wrapBoundSuccess: function(test) {
    test.expect(2);
    var cls = new Class();
    var add = pr.wrapBound(cls, cls.add);
    add(2)
      .then(function(result) {
        test.equal(result, 3, "Context lost.")
        return add(3);
      })
      .then(function(result) {
        test.equal(result, 4, "Context lost.")
      })
      .then(test.done, test.done);
  },

  wrapBoundFailure: function(test) {
    test.expect(3);
    var cls = new Class();
    var fail = pr.wrapBound(cls, cls.fail);
    fail()
      .catch(function(err) {
        test.ok(err instanceof Error, "Unexpected Error type.");
        test.equal(err.message, "Class.fail 1", "Incorrect Error message.");
        return fail();
      })
      .catch(function(err) {
        test.equal(err.message, "Class.fail 1", "Incorrect Error message.");
      })
      .then(test.done, test.done);
  },

  argsNotModified: function(test) {
    test.expect(1);
    var originalArgs = [goodFile];
    var args = originalArgs.slice();
    pr.apply(fs.stat, args)
      .then(function(stats) {
        test.deepEqual(args, originalArgs, "Arguments array modified.");
      })
      .then(test.done, test.done);
  }
};
