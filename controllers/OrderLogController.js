const orderLogs = require('../models/OrderLogs');

module.exports = {
  getOrderLog: function (req, res, _) {
    orderLogs.getOrderLogs()
      .then(data =>
        res.status(200).send(data))
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      })
  },
};