#!/usr/bin/env node
var fetch = require('../lib/fetch');
var insert = require('../lib/insert');

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
var m = dburl.match(/([^:]+)\:\/\/([^:]+):([^@]+)@([^\/]+)\/([^\/]+)\/?(.+)?/);
var client = m[1] || exit('No client');
var user = m[2] || exit('No user');
var password = m[3] || exit('No password');
var host = m[4] || exit('No host');

var db = m[5] || null;
var table = m[6] || (insertCheck ? exit('No table') : null);

var config = {
  client: client,
  connection: {
    host: host,
    user: user,
    password: password,
    database: db,
  },
};

var conn = require('knex')(config);
var method = insertCheck ? insert.bind(null, table) : fetch;

method(conn, function(err) {
  if (err) exit('Error when closing ' + err);
  process.exit(0);
});
