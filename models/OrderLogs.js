const {getConnection, releaseConnection} = require('../db');

const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

module.exports = {
  getOrderLogs: function (limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET) {
    return new Promise((resolve, reject) => {
      let con;

      getConnection()
        .then(connection => {
          con = connection
        })
        .then(() => {
          return con.query(
            `select ol.timestamp,
                    p.process_name   process_name,
                    r.name           robot_name,
                    ol.order_content order_content,
                    ou.name          order_user_name
             from order_logs ol
                      join robots r on ol.robot_id = r.id
                      join processes p on r.process_id = p.id
                      join order_users ou on ol.order_user_id = ou.id
             order by ol.timestamp desc
             limit ? offset ?`, [limit, offset]
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
};
