"use strict";

module.exports.call = function call(fn) {
  var args = Array.prototype.slice.call(arguments, 1);
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
};
