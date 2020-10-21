const robot = require('../models/Robot');
const command = require('../constants/command.constants');

//const dateFormat = require('dateformat');

const LIMIT = 30;

module.exports = {
  getChartData: function (req, res, _) {
    robot.getRedis(command.POSITION_DATA, 101, LIMIT)
      .then(data => {
        var positionData = data;
        robot.getRedis(command.TORQUE_DATA, 1, LIMIT)
          .then(data => {
            var torqueData = data;
            res.status(200).send({
              [command.POSITION_DATA]: positionData,
              [command.TORQUE_DATA]: torqueData,
            });
          })
          .catch(error => {
            console.log(error);
            res.status(500).send(error);
          });
      })
      .catch(error => {
        console.log(error);
        res.status(500).send(error);
      })
  },
};
