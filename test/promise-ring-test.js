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
Class.prototype.swap = function(left, right, cb) {
  cb(null, right, left);
}

module.exports = {
  callSuccess: function(test) {
    test.expect(2);
    pr.call(fs.stat, goodFile)
      .then(function(stats) {
        test.ok(stats instanceof fs.Stats, "Unexpected Stats type.");
        test.ok(stats.isFile(), "Unexpected result.");
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
        test.ok(stats.isFile(), "Unexpected result.");
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
        test.ok(stats.isFile(), "Unexpected result.");
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

  wrapAll: function(test) {
    test.expect(5);
    var fsw = pr.wrapAll(fs);
    var clsw = pr.wrapAll(new Class());
    fsw.stat(goodFile)
      .then(function(stats) {
        test.ok(stats instanceof fs.Stats, "Unexpected Stats type.");
        test.ok(stats.isFile(), "Unexpected result.");
        return fsw.readFile(goodFile);
      })
      .then(function(content) {
        test.ok(content.length > 0, "Empty file content.");
        return clsw.add(2);
      })
      .then(function(result) {
        test.equal(result, 3, "Context lost.");
        return clsw.fail();
      })
      .catch(function(err) {
        test.equal(err.message, "Class.fail 1", "Incorrect Error message.");
      })
      .then(test.done, test.done);
  },

  multipleValuesResolveWithArray: function(test) {
    test.expect(2);
    var cls = new Class();
    pr.call(cls.swap, 1, 2)
      .then(function(result) {
        test.ok(result instanceof Array, "Unexpected result type.");
        test.deepEqual(result, [2, 1], "Unexpected result.")
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
