"use strict";

var slice = Array.prototype.slice;

exports.applyBound = function applyBound(thisArg, fn, args) {
  args = slice.call(args || []);
  return new Promise(function executor(resolve, reject) {
    args.push(function fnCallback(err, arg) {
      if (err) {
        reject(err);
      } else {
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
