const express = require('express');
const app = express();
const mysql = require('promise-mysql');

// MySQLのコネクションプールを作成
const config = require('./config/db.json')[app.get('env')];
const pool = mysql.createPool({
  host: config.db_host,
  port: config.db_port ? config.db_port : 3306,
  user: config.db_user,
  password: config.db_pass,
  database: config.db_name,
  timezone: 'Asia/Tokyo',
  connectionLimit: 10,
});

const getConnection = async function () {
  return pool.then(
    pool => pool.getConnection()
  ).catch(
    err => {
      console.log(err);
      throw err;
    }
  );
};

const releaseConnection = function (connection) {
  if (connection !== undefined) {
    pool.then(
      pool => pool.releaseConnection(connection)
    ).catch(
      err => console.log(err)
    );
  }
};

console.log("MySQL Connection Pool Created.");
module.exports = {poolPromise: pool, getConnection, releaseConnection};
