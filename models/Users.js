const table = 'users';

const {poolPromise} = require('../db');

module.exports = {
  getUsers: function (id) {
    return new Promise((resolve, reject) => {
      let currentConnection;
      let currentPool;

      poolPromise
        .then((pool) => {
          currentPool = pool;
          return pool;
        })
        .then((pool) => {
          return pool.getConnection();
        })
        .then((connection) => {
          currentConnection = connection;
          return connection;
        })
        .then((connection) => {
          return connection.query(
            `select * from ${table}`, id);
        })
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        })
        .then(() => {
          if (currentConnection !== undefined) {
            currentPool.releaseConnection(currentConnection);
          }
        });
    });
  },
};
