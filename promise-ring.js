"use strict";

exports.apply = function apply(fn, args) {
  args = Array.isArray(args) ? args.slice() : [];
  return new Promise(function executor(resolve, reject) {
    args.push(function fnCallback(err) {
      if (err) {
        reject(err);
      } else {
        resolve.apply(null, Array.prototype.slice.call(arguments, 1));
      }
    });
    fn.apply(null, args);
  });
}

exports.call = function call(fn) {
  var args = Array.prototype.slice.call(arguments, 1);
  return exports.apply(fn, args);
};
