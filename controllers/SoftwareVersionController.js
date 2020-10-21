const robot = require('../models/Robot');
const command = require('../constants/command.constants');
const common = require('../models/Common');

module.exports = {
  getSoftVersion: function (req, res, _) {
    common.getSystemInfo()
      .then(data => {
        res.status(200).send(data);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send(error);
      })
  },
};
