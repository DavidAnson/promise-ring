"use strict";

// promise-ring requires a Promise implementation as available in io.js and
// Node.js 0.12 and later
var throwReferenceErrorIfPromiseNotDefined = Promise;
var slice = Array.prototype.slice;

exports.applyBound = function applyBound(thisArg, fn, args) {
  args = slice.call(args || []);
  return new Promise(function executor(resolve, reject) {
    args.push(function fnCallback(err, arg) {
      if (err) {
        reject(err);
      } else {
        if (arguments.length > 2) {
          arg = slice.call(arguments, 1);
        }
        resolve(arg);
      }
    });
    fn.apply(thisArg, args);
  });
}

exports.apply = function apply(fn, args) {
  return exports.applyBound(undefined, fn, args);
};

exports.callBound = function callBound(thisArg, fn) {
  var args = slice.call(arguments, 2);
  return exports.applyBound(thisArg, fn, args);
};

exports.call = function call(fn) {
  var args = slice.call(arguments, 1);
  return exports.applyBound(undefined, fn, args);
};

exports.wrapBound = function wrapBound(thisArg, fn) {
  return exports.callBound.bind(undefined, thisArg, fn);
};

exports.wrap = function wrap(fn) {
  return exports.call.bind(undefined, fn);
};

exports.wrapAll = function wrapAll(obj) {
  var wrapper = {};
  for (var key in obj) {
    if (obj[key] instanceof Function) {
      wrapper[key] = exports.wrapBound(obj, obj[key]);
    }
  }
  return wrapper;
};
