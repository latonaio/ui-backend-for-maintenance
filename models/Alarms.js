const {getConnection, releaseConnection} = require('../db');

const limit = 100;

module.exports = {
  get: function (robot_id, category) {
    return new Promise((resolve, reject) => {
      let con;

      getConnection()
        .then(connection => {
          con = connection
        }).then(() => {
        return con.query(
            `select *
             from Maintenance.alarms_yaskawa
             where robot_id = ?
               and AlarmCategory = ?
             order by AlarmTime desc
             limit ?;
          `,
          [robot_id, category, limit]
        );
      }).then(rows => {
        releaseConnection(con);
        if (rows.length > 0) {
          resolve(rows);
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