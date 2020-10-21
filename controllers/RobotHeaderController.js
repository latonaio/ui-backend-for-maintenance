const robots = require('../models/Robots');

module.exports = {
  getRobotName: function (req, res, _) {
    robots.getRobotName(req.params.robotID)
      .then(data =>
        res.status(200).send(data)
      )
      .catch(error => {
        console.log(error);
        res.status(500).send(error);
      })
  },
};