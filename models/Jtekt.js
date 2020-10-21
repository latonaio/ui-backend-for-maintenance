const {getConnection, releaseConnection} = require('../db');
const Redis = require('ioredis');
const express = require('express');
var app = express();
var config = require('../config/db.json')[app.get('env')];
const client = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  db: config.redis.db.JTEKT,
  showFriendlyErrorStack: true
});

client.on('connect', function () {
  console.log('success connection to Redis');
});
client.on('error', function (err) {
  console.log('failed connection to Redis：' + err);
});

module.exports = {
  getRedis: function (key_cmd, arrayNo, limit = 1) {
    return new Promise((resolve, reject) => {
      let date = new Date();
      client.zrevrangebyscore(
        `key-list:${key_cmd}:${arrayNo}`,
        "+inf", date.getTime(),
        "LIMIT",
        0,
        limit)
        .then(keys =>
          Promise.all(keys.map(key =>
            Promise.all([key, client.hgetall(key)])))
        )
        .then(items =>
          Promise.all(items.map(item => appendKeyInfo(item[0], item[1]))))
        .then(data => resolve(data))
        .catch(error => {
          reject(error);
          console.log(error);
        });
    });
  },
  queryMysql: function (sql, binds = []) {
    return new Promise((resolve, reject) => {
      let con;

      getConnection()
        .then(connection => {
          con = connection;
        })
        .then(() => {
          return con.query(sql, binds);
        })
        .then(value => {
          resolve(value);
        })
        .catch(error => {
          reject(error);
        })
        .then(() => {
          if (con) {
            releaseConnection(con);
          }
        });
    });
  },
};

function appendKeyInfo(key, hash) {
  let tokens = key.split(",");

  return {
    ...hash,
    CommandNo: tokens[1],
    IP: tokens[2],
    TimeStamp: tokens[3],
    ID: tokens[4],
  };
}
