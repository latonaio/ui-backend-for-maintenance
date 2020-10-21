const robot = require('../models/Robot');
const command = require('../constants/command.constants');

module.exports = {
  getOffset: function (req, res, _) {
    robot.getRedis(command.POSITION_DATA, 101, 1)
      .then(data => {
        res.status(200).send(data);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send(error);
      })
  },
};