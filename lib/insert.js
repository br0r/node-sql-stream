var Transform = require('stream').Transform;
var split = require('split');

var buffer = function () {
  var b = [];
  var SIZE = 1000;

  var t = new Transform({
    objectMode: true,
    transform: function (chunk, enc, next) {
      b.push(chunk);

      if (b.length >= SIZE) {
        this.push(b.splice(0, SIZE));
      }

      next();
    },

    flush: function (cb) {
      this.push(b);
      cb();
    },
  });

  return t;
};

var insert = function (conn, table) {
  return new Transform({
    objectMode: true,
    transform: function (chunk, enc, next) {
      conn.raw(conn(table).insert(chunk).toString().replace(/^insert/i, 'insert ignore'))
      .then(() => next())
      .catch(next);
    },
  });
};

module.exports = function (table, conn, cb) {
  var err = function(e) {
    console.error(e);
    cb(e);
  }

  process.stdin
  .pipe(split(JSON.parse, null, {trailing: false}))
  .on('error', err)
  .pipe(buffer())
  .on('error', err)
  .pipe(insert(conn, table))
  .on('error', err)
  .on('finish', function () {
    cb();
  });
};
