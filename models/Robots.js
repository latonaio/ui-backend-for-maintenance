const {getConnection, releaseConnection} = require('../db');

module.exports = {
  getRobotName: function (robotID) {
    return new Promise((resolve, reject) => {
      let con;

      getConnection()
        .then(connection => {
          con = connection
        }).then(() => {
        return con.query(
          `select r.id           robotID,
                    r.name         robotName,
                    r.process_id   processID,
                    p.process_name processName
             from robots r
                      join processes p on r.process_id = p.id
             where r.id = ?`, robotID
        );
      }).then(rows => {
        releaseConnection(con);
        if (rows.length > 0) {
          resolve(rows[0]);
        } else {
          resolve({});
        }
      }).catch(error => {
        if (con) {
          releaseConnection(con);
        }
        reject(error);
      });
    });
  },
};