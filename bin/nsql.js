#!/usr/bin/env node
var fetch = require('../lib/fetch');
var insert = require('../lib/insert');
var debug = require('debug')('nsql:core');

function exit(msg) {
  console.error(msg);
  process.exit(1);
}

if (process.argv.length <= 2) {
  exit('Too few arguments, should be `nsql dburl [query]`');
}

let insertCheck = process.argv.length === 3;

if (process.argv.length > 4) {
  exit('Too many arguments');
}

var dburl = process.argv[2];
var m = dburl.match(/([^:]+)\:\/\/([^:]+):([^@]+)@([^\/\:]+)(\:[0-9]+)?\/([^\/]+)\/?(.+)?/);
var client = m[1] || exit('No client');
var user = m[2] || exit('No user');
var password = m[3] || exit('No password');
var host = m[4] || exit('No host');
var port = m[5];
if (port) port = parseInt(port.substr(1));

var db = m[6] || null;
var table = m[7] || (insertCheck ? exit('No table') : null);

debug('client', client);
debug('user', user);
debug('host', host);
debug('port', port);
debug('db', db);
debug('table', table);

var config = {
  client: client,
  connection: {
    host: host,
    port: port,
    user: user,
    password: password,
    database: db,
  },
};

var conn = require('knex')(config);
var method = insertCheck ? insert.bind(null, table) : fetch;
conn.on('error', function(e) {
  console.error(e);
  process.exit(1);
});

method(conn, function(err) {
  if (err) exit('Error when closing ' + err);
  process.exit(0);
});
