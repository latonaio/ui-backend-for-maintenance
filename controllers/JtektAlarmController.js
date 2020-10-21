const jtekt = require('../models/Jtekt');
const command = require('../constants/command.constants');

// Jtect用に修正
const ALARM_LOG_LENGTH = 50;


module.exports = {
  getAlarm: function (req, res, _) {
    Promise.all(
      Array.from(Array(ALARM_LOG_LENGTH), (v, k) => k).map(arrayNo => (
        jtekt.getRedis(command.FAULTED_DEVICE, arrayNo, 1)
          .then(data => data[0] === undefined ? {} : data[0])
      )))
      .then(data => res.status(200).send(data))
      .catch(error => {
        console.log(error);
        res.status(500).send(error);
      })
  },
};
