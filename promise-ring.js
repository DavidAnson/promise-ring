"use strict";

// promise-ring *requires* a native Promise implementation
//   (available in io.js and Node.js 0.12+)
(function throwReferenceErrorIfPromiseNotDefined() {}(Promise));
var slice = Array.prototype.slice;

/**
 * Invokes a Function that takes a callback; converts the result to a Promise.
 *
 * @param {Object} thisArg Value of this for the call to fn.
 * @param {Function} fn Function to invoke.
 * @param {Array} argsArray Arguments for fn, no callback.
 * @returns {Promise} Promise for result.
 */
exports.applyBound = function applyBound(thisArg, fn, argsArray) {
  argsArray = slice.call(argsArray || []);
  return new Promise(function executor(resolve, reject) {
    argsArray.push(function fnCallback(err, arg) {
      if (err) {
        reject(err);
      } else {
        if (arguments.length > 2) {
          arg = slice.call(arguments, 1);
        }
        resolve(arg);
      }
    });
    fn.apply(thisArg, argsArray);
  });
};

/**
 * Invokes a Function that takes a callback; converts the result to a Promise.
 *
 * @param {Function} fn Function to invoke.
 * @param {Array} argsArray Arguments for fn, no callback.
 * @returns {Promise} Promise for result.
 */
exports.apply = function apply(fn, argsArray) {
  return exports.applyBound(undefined, fn, argsArray);
};

/**
 * Invokes a Function that takes a callback; converts the result to a Promise.
 *
 * @param {Object} thisArg Value of this for the call to fn.
 * @param {Function} fn Function to invoke, followed by arguments, no callback.
 * @returns {Promise} Promise for result.
 */
exports.callBound = function callBound(thisArg, fn) {
  var argsArray = slice.call(arguments, 2);
  return exports.applyBound(thisArg, fn, argsArray);
};

/**
 * Invokes a Function that takes a callback; converts the result to a Promise.
 *
 * @param {Function} fn Function to invoke, followed by arguments, no callback.
 * @returns {Promise} Promise for result.
 */
exports.call = function call(fn) {
  var argsArray = slice.call(arguments, 1);
  return exports.applyBound(undefined, fn, argsArray);
};

/**
 * Wraps a Function that takes a callback with one that returns a Promise.
 *
 * @param {Object} thisArg Value of this for the call to fn.
 * @param {Function} fn Function to wrap.
 * @returns {Function} Wrapped Function that returns a Promise for fn.
 */
exports.wrapBound = function wrapBound(thisArg, fn) {
  return exports.callBound.bind(undefined, thisArg, fn);
};

/**
 * Wraps a Function that takes a callback with one that returns a Promise.
 *
 * @param {Function} fn Function to wrap.
 * @returns {Function} Wrapped Function that returns a Promise for fn.
 */
exports.wrap = function wrap(fn) {
  return exports.call.bind(undefined, fn);
};

/**
 * Wraps all Functions of an Object with bound Functions that returns a Promise.
 *
 * @param {Object} obj Object with Functions to wrap.
 * @returns {Object} Wrapped Object with functions that returns a Promise.
 */
exports.wrapAll = function wrapAll(obj) {
  var wrapper = {};
  for (var key in obj) {
    if (obj[key] instanceof Function) {
      wrapper[key] = exports.wrapBound(obj, obj[key]);
    }
  }
  return wrapper;
};
