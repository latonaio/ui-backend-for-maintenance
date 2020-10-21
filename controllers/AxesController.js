const robot = require('../models/Robot');
const command = require('../constants/command.constants');
const common = require('../models/Common');

const LIMIT = 1;

module.exports = {
  getAxes: function (req, res, _) {
    common.getAxesInfo()
      .then(data => {
        res.status(200).send(data);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send(error);
      })
  },
};
