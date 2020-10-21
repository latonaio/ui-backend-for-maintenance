const {getConnection, releaseConnection} = require('../db');

module.exports = {
  getByMacAddress: function (macAddress) {
    return new Promise((resolve, reject) => {
      let con;

      getConnection()
        .then(connection => {
          con = connection
        }).then(() => {
        return con.query(
            `select *
             from Maintenance.backupfiles
             where macAddress = ?
             order by date desc;
          `,
          [macAddress]
        );
      }).then(rows => {
        releaseConnection(con);
        resolve(rows);
      }).catch(error => {
        if (con) {
          releaseConnection(con);
        }
        reject(error);
      });
    });
  },
};