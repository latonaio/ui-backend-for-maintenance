const fs = require('fs');
const path = require('path');
const dateFormat = require('dateformat');

const directoryConstants = require('../constants/directory.constants');
const jobScheduler = require('../models/JobScheduler');

module.exports = {
  getJob: function (req, res, _) {
    jobScheduler.getJob(req.params.makerID)
      .then(data =>
        res.status(200).send(data))
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      })
  },
  getMachine: function (req, res, _) {
    jobScheduler.getMachine(req.params.jobID)
      .then(data =>
        res.status(200).send(data))
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      })
  },
  setSchedule: function (req, res, _) {
    const data = requestFilter(req.body.data);
    const cron_date = generateCronDate(data);
    const now = new Date();

    jobScheduler.setSchedule(data, cron_date)
      .then(result => {
        const deviceName = process.env.DEVICE_NAME
        const target = 'job-scheduler'

        // TODO: for multi schedules
        const directNextJson = {
          connections: {
            [target]: {
              deviceName: deviceName,
              outputDataPath: path.join("/var/lib/aion/Data", target + "_1"),
              metadata: {
                schedule_list: {
                  job_id: data.jobID,
                  schedule: [{
                    schedule_id: 1,
                    repeat_type: data.repeatType,
                    start_date: data.startDate,
                    end_date: data.endDate,
                    cron_date: cron_date
                  }],
                  machine_list: data.targetMachineIDList
                }
              },
            }
          }
        }
        if(cron_date!==''){
          outputJsonFile(directNextJson, target, now);
          console.log('call core backend')
        }
        console.log('setSchedule finished')
        res.status(200).send(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      })
  },
};

function requestFilter(body){
  let newBody = {
      'jobID': body.jobID,
      'repeatType': body.repeatType,
      'repeatHour': body.repeatHour===null ? 0 : body.repeatHour,
      'repeatMinute': body.repeatMinute===null ? 0 : body.repeatMinute,
      'repeatWeekDay': null,
      'repeatDate': null,
      'startDate': body.startDate,
      'endDate': body.endDate,
      'targetMachineIDList': body.targetMachineIDList,
  }

  switch(body.repeatType) {
    case 1: // every month
      newBody.repeatDate = body.repeatDate
      break;
    case 2: // every week
      newBody.repeatWeekDay = body.repeatWeekDay
      break;
  }

  return newBody;
}

function generateCronDate(body) {
  if(body.startDate===null || body.endDate===null){
    return '';
  }
  switch(body.repeatType) {
    case 1: // every month
      if(body.repeatMinute===null || body.repeatHour===null || body.repeatDate===null){
        return '';
      }else{
        if(body.repeatHour < 9){
          if(body.repeatDate == 1){
            return `${body.repeatMinute} ${body.repeatHour+15} 31 * *`;
          }else{
            return `${body.repeatMinute} ${body.repeatHour+15} ${body.repeatDate-1} * *`;
          }
        }else{
          return `${body.repeatMinute} ${body.repeatHour-9} ${body.repeatDate} * *`;
        }
      }
    case 2: // every week
      if(body.repeatMinute===null || body.repeatHour===null || body.repeatWeekDay===null){
        return '';
      }else{
        if(body.repeatHour < 9){
          return `${body.repeatMinute} ${body.repeatHour+15} * * ${body.repeatWeekDay-1}`;
        }else{
          return `${body.repeatMinute} ${body.repeatHour-9} * * ${body.repeatWeekDay}`;
        }
      }
    case 3: // every day
      if(body.repeatMinute===null || body.repeatHour===null){
        return '';
      }else{
        if(body.repeatHour < 9){
          return `${body.repeatMinute} ${body.repeatHour+15} * * *`;
        }else{
          return `${body.repeatMinute} ${body.repeatHour-9} * * *`;
        }
      }
    case 4: // only once
      if(body.repeatMinute===null || body.repeatHour===null){
        return '';
      }
      const start_date_dt = new Date(body.startDate);
      const end_date_dt = new Date(body.endDate);
      end_date_dt.setDate(end_date_dt.getDate()+1)

      let execute_dt = new Date(
        start_date_dt.getFullYear(), start_date_dt.getMonth(), start_date_dt.getDate(), 
        body.repeatHour, body.repeatMinute-start_date_dt.getTimezoneOffset());
      if(start_date_dt > execute_dt){
        execute_dt.setMonth( start_date_dt.getMonth()+1 )
      }
      console.log(start_date_dt, execute_dt, end_date_dt)
      if(end_date_dt < execute_dt){
        return '';
      }

      execute_dt.setHours(execute_dt.getHours()-9)
      return `${execute_dt.getUTCMinutes()} ${execute_dt.getUTCHours()} ${execute_dt.getUTCDate()} ${execute_dt.getUTCMonth()+1} *`;
  }
}

const outputJsonFile = (data, prefix, now) => {
  if (now === undefined) {
    now = new Date();
  }
  const outputPath = directoryConstants.jsonOutputDir + '/'
    + prefix + '_' + dateFormat(now, "yyyymmddHHMMssl") + '.json';

  try {
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 4));
    console.log("Successfully Written to " + outputPath);
    return outputPath;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

