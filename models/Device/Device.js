const {getConnection, releaseConnection} = require('../../db');

module.exports = {
  fetchDevices: function () {
    return new Promise((resolve, reject) => {
      let con;
      getConnection()
        .then(connection =>
          con = connection
        )
        .then(() =>
          con.query(
              `select d.deviceName,
                      d.projectSymbolFk,
                      d.deviceIp,
                      d.macAddress,
                      d.connectionStatus,
                      d.os
               from Device.device d
               order by d.deviceName`
          )
        )
        .then(result => {
          releaseConnection(con);
          resolve(result);
        })
        .catch(error => {
          if (con) {
            releaseConnection(con);
          }
          reject(error);
        });
    });
  },
  getByMakerID: function (makerID) {
    return new Promise((resolve, reject) => {
      let con;
      getConnection()
        .then(connection =>
          con = connection
        )
        .then(() =>
          con.query(
              `select d.deviceName,
                      d.projectSymbolFk,
                      d.deviceIp,
                      d.macAddress,
                      d.connectionStatus,
                      d.os
               from Device.device d
               where d.makerId = ?
               order by d.deviceName`,
            makerID
          )
        )
        .then(result => {
          releaseConnection(con);
          resolve(result);
        })
        .catch(error => {
          if (con) {
            releaseConnection(con);
          }
          reject(error);
        });
    });
  }
};
