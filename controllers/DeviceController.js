const device = require('../models/Device/Device');

module.exports = {
  fetchDevices: function (req, res, _) {
    device.fetchDevices()
      .then(data => res.status(200).send(data))
      .catch(error => {
        console.log(error);
        res.status(500).send(error);
      })
  },
};