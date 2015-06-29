# promise-ring

> Convenience methods for converting Node.js callbacks into native Promises.

[![npm version][npm-image]][npm-url]
[![GitHub tag][github-tag-image]][github-tag-url]
[![Build status][travis-image]][travis-url]
[![Coverage][coveralls-image]][coveralls-url]
[![License][license-image]][license-url]

## Install

```shell
npm install promise-ring --save
```

## Overview

`promise-ring` is *small, simple library* with *no external dependencies* that
eases the use of *native JavaScript Promises* in projects *without requiring a
Promise library*.

> **Important**: `promise-ring` requires a native `Promise` implementation. If
> `Promise` is not defined, it throws immediately. Therefore, projects needing
> to support older run-times (like Node.js 0.10.x) should look for similar
> functionality from a library like [Q](https://github.com/kriskowal/q),
> [Bluebird](https://github.com/petkaantonov/bluebird),
> [promise](https://github.com/then/promise), etc..

For more about using `Promise`s to write better code:

* [Promise, Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* [JavaScript Promises, HTML5 Rocks](http://www.html5rocks.com/en/tutorials/es6/promises/)
* [Promises, Forbes Lindesay](https://www.promisejs.org/)
* [Promises/A+, specification](https://promisesaplus.com/)

## API / Examples

Each of the following snippets comes from the [example](example) directory in
the repository and assumes the following `require`s:

```js
var fs = require("fs");

var Database = require("./database.js");
var db = new Database("MockDB");

var pr = require("promise-ring");
```

### call

`call` wraps a single invocation of a callback-based method and returns a
`Promise`. If the first (i.e., "error") parameter of the callback is not null,
the `Promise` is rejected. Otherwise, the `Promise` is resolved with the second
parameter of the callback. If the callback received multiple parameters, the
`Promise` is resolved with an `Array` of them.

```js
pr.call(fs.readFile, "../package.json", { "encoding": "utf8" })
  .then(function(data) {
    console.log(JSON.parse(data).name);
  });
```

### apply

`apply` is to `call` as [`Function.apply`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
is to [`Function.call`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call).

```js
pr.apply(fs.readFile, [ "../package.json", { "encoding": "utf8" } ])
  .then(function(data) {
    console.log(JSON.parse(data).name);
  });
```

### callBound

`callBound` is like `call` but allows the `thisArg` to be specified for
scenarios that require it (like class instances).

```js
pr.callBound(db, db.query, "promise-ring")
  .then(function(result) {
    console.log(result);
  });
```

### applyBound

`applyBound` is to `callBound` as `apply` is to `call`.

```js
pr.applyBound(db, db.query, [ "promise-ring" ])
  .then(function(result) {
    console.log(result);
  });
```

### wrap

Instead of using `call` multiple times for the same function, `wrap` creates a
wrapper function that can be used multiple times wherever it is needed.

```js
var readFile = pr.wrap(fs.readFile);

readFile("../package.json", { "encoding": "utf8" })
  .then(function(data) {
    console.log(JSON.parse(data).name);
  });
```

### wrapBound

`wrapBound` is to `wrap` as `apply` is to `call`.

```js
var dbquery = pr.wrapBound(db, db.query);

dbquery("promise-ring")
  .then(function(result) {
    console.log(result);
  });
```

### wrapAll

As a convenience, `wrapAll` creates `Promise` wrappers for **all** functions on
an object. It automatically binds `thisArg` to the object instance (similar to
the `*Bound` functions above).

**Note**: `wrapAll` is not smart and may include functions that don't take a
callback - it's up to the author to ensure only appropriate wrappers are used.

```js
var fsw = pr.wrapAll(fs);
var dbw = pr.wrapAll(db);

fsw.readFile("../package.json", { "encoding": "utf8" })
  .then(function(data) {
    console.log(JSON.parse(data).name);
  });

dbw.query("promise-ring")
  .then(function(result) {
    console.log(result);
  });
```

## History

* 0.0.1 - Initial release.

[npm-image]: https://img.shields.io/npm/v/promise-ring.svg
[npm-url]: https://www.npmjs.com/package/promise-ring
[github-tag-image]: https://img.shields.io/github/tag/DavidAnson/promise-ring.svg
[github-tag-url]: https://github.com/DavidAnson/promise-ring
[travis-image]: https://img.shields.io/travis/DavidAnson/promise-ring/master.svg
[travis-url]: https://travis-ci.org/DavidAnson/promise-ring
[coveralls-image]: https://img.shields.io/coveralls/DavidAnson/promise-ring/master.svg
[coveralls-url]: https://coveralls.io/r/DavidAnson/promise-ring
[license-image]: https://img.shields.io/npm/l/promise-ring.svg
[license-url]: http://opensource.org/licenses/MIT
