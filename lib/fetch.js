var Transform = require('stream').Transform;
var os = require('os');

var toString = new Transform({
  objectMode: true,
  transform: function(chunk, enc, next) {
    this.push(JSON.stringify(chunk) + os.EOL);
    next();
  },
});

module.exports = function(conn, cb) {
  var query = process.argv[3];
  conn.raw(query)
  .stream({ highWaterMark: 5 })
  .pipe(toString)
  .on('end', function () {
    cb();
  })
  .pipe(process.stdout);
}
