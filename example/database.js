"use strict";

// A mock asynchronous database that requires correct "this" context

function Database(prefix) {
  this.prefix = prefix;
}

Database.prototype.query = function(term, callback) {
  var self = this;
  setTimeout(function() {
    callback(null, self.prefix + ": " + term);
  });
};

module.exports = Database;
