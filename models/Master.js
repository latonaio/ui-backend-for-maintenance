const {getConnection, releaseConnection} = require('../db');

const robots_table = 'Maintenance.robots';
const process_table = 'Maintenance.processes';

module.exports = {
  getProcess: function (id) {
    return new Promise((resolve, reject) => {
      let con;

      getConnection()
        .then(connection => {
          con = connection
        })
        .then(() => {
          return con.query(
            `select * from ${process_table}
                  where id = ?`, `${id}`
          );
        })
        .then(rows => {
          resolve(rows);
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
  getRobots: function () {
    return new Promise((resolve, reject) => {
      let con;

      getConnection()
        .then(connection => {
          con = connection;
        })
        .then(() => {
          return con.query(
            `select * from ${robots_table}`
          );
        })
        .then(rows => {
          resolve(rows);
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
  getBackupInfo: function (macAddress) {
    return new Promise((resolve, reject) => {
      let con;

      getConnection()
        .then(connection => {
          con = connection
        })
        .then(() => {
          return con.query(
            //`select * from ${backup_table} order by date desc`
              `select macAddress,
                      group_concat(path) as path,
                      date,
                      max(state)         as state
               from Maintenance.backupfiles
               where macAddress = ?
               group by date, macAddress
               order by date desc`,
            [macAddress]
          );
        })
        .then(rows => {
          resolve(rows);
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
  getMachine: function (maker_id) {
    return new Promise((resolve, reject) => {
      let con;

      getConnection()
        .then(connection => {
          con = connection
        })
        .then(() => {
          return con.query(
            `select * from Device.device where makerId = ${maker_id}`
          );
        })
        .then(rows => {
          resolve(rows);
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
  }
};
