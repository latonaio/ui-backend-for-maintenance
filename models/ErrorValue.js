const {getConnection, releaseConnection} = require('../db');

module.exports = {
  getErrorValue: function () {
    return new Promise((resolve, reject) => {
      let con;
      getConnection()
        .then(connection =>
          con = connection
        )
        .then(() =>
          con.query(`select ev.timestamp,
                            ev.robot_id,
                            ev.command_no,
                            met.name error_type,
                            ev.error_value,
                            ev.min_threshold,
                            ev.max_threshold,
                            r.name   robot_name
                     from Maintenance.error_values ev
                              left join Maintenance.robots r on ev.robot_id = r.id
                              left join Maintenance.master_error_type met on ev.error_type = met.id
                     order by timestamp desc
                     limit 20`)
        )
        .then(result => {
          resolve(result);
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
