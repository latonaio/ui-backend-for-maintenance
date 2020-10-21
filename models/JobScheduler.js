const {getConnection, releaseConnection} = require('../db');

module.exports = {
  getJob: function (makerID) {
    return new Promise((resolve, reject) => {
      let con;

      getConnection()
        .then(connection => {
          con = connection
      }).then(() => {
        return con.query(`
SELECT
job.job_id AS job_id,
job.job_name AS job_name,
js.schedule_id AS schedule_id,
js.repeat_type AS repeat_type,
js.repeat_date AS repeat_date,
js.repeat_week_day AS repeat_week_day,
js.repeat_hour AS repeat_hour,
js.repeat_minute AS repeat_minute,
js.start_date AS start_date,
js.end_date AS end_date,
job.last_state AS last_state
FROM job job
LEFT JOIN job_schedule js
ON job.job_id = js.job_id
WHERE maker_id = ?;`, makerID
        );
      }).then(rows => {
        releaseConnection(con);
        if (rows.length > 0) {
          resolve(shapingJobList(rows));
        } else {
          resolve([]);
        }
      }).catch(error => {
        if (con) {
          releaseConnection(con);
        }
        reject(error);
      });
    });
  },
  getMachine: function (jobID) {
    return new Promise((resolve, reject) => {
      let con;

      getConnection()
        .then(connection => {
          con = connection
      }).then(() => {
        return con.query(`
SELECT 
ma.machine_id AS machineID,
ma.machine_name AS machineName
FROM jobs_has_machines jhm
INNER JOIN machine ma
ON jhm.machine_id = ma.machine_id
WHERE jhm.job_id = ?;`, jobID
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
  setSchedule: function (data, cron_date) {
    return new Promise((resolve, reject) => {
      const job_id = data.jobID
      const schedule_id = 1;
      const targetMachineIDList = data.targetMachineIDList;

      let con;

      const now = new Date().toISOString().replace(/T/,' ').replace(/\..+/,'');
      getConnection()
        .then(connection => {
          con = connection
      }).then(() => {
        return con.query(`INSERT INTO job_schedule_log
(log_date,job_id,schedule_id,repeat_type,repeat_date,repeat_week_day,
repeat_hour,repeat_minute,start_date,end_date)
values (?,?,?,?,?,?,?,?,?,?)`, 
[now,job_id,schedule_id,data.repeatType,data.repeatDate,data.repeatWeekDay,
data.repeatHour,data.repeatMinute,data.startDate,data.endDate]);
      }).then(() => {
        return con.query(`DELETE FROM job_schedule WHERE job_id = ?;`, job_id);
      }).then(() => {
        // TODO: for multi schedules
        return con.query(`
INSERT INTO job_schedule
(job_id,schedule_id,repeat_type,repeat_date,repeat_week_day,
repeat_hour,repeat_minute,start_date,end_date,cron_date)
values (?,?,?,?,?,?,?,?,?,?)`,
[job_id,schedule_id,data.repeatType,data.repeatDate,data.repeatWeekDay,
data.repeatHour,data.repeatMinute,data.startDate,data.endDate,cron_date]);
      }).then(() => {
        return con.query(`DELETE FROM jobs_has_machines WHERE job_id = ?;`, job_id);
      }).then(() => {
        if ( targetMachineIDList!==undefined && targetMachineIDList.length > 0) {
          let sql = `INSERT INTO jobs_has_machines (job_id, machine_id) values `;
          let valus = [];
          targetMachineIDList.forEach((machine_id) => {
            sql += `(?,?),`
            valus.push(job_id, machine_id)
          });
          return con.query(sql.slice(0,-1)+`;`, valus);
        }
      }).then(() => {
        console.log('db finished')
        releaseConnection(con);
        resolve({result: true});
      }).catch(error => {
        if (con) {
          releaseConnection(con);
        }
        reject(error);
      });
    });
  },
};

function shapingJobList(rows) {
  let jobList = {};

  for(i=0; i<rows.length; i++){
    const row = rows[i];
    const schedule = {
      'scheduleID': row.schedule_id===null ? 0: row.schedule_id,
      'repeatType': row.repeat_type===null ? 0: row.repeat_type,
      'repeatDate': row.repeat_date===null ? '': row.repeat_date,
      'repeatWeekDay': row.repeat_week_day===null ? '': row.repeat_week_day,
      'repeatHour': row.repeat_hour===null ? '': row.repeat_hour,
      'repeatMinute': row.repeat_minute===null ? '': row.repeat_minute,
      'startDate': row.start_date===null ? '': row.start_date,
      'endDate': row.end_date===null ? '': row.end_date
    }

    if(jobList[row.job_id] === undefined){
      jobList[row.job_id] = {
        'jobID': row.job_id,
        'jobName': row.job_name,
        'schedule': [schedule],
        'lastState': row.last_state
      }
    } else { 
      jobList[row.job_id]['schedule'].push(schedule);
    }
  }
  return Object.values(jobList);
}

