const errorValue = require('../models/ErrorValue');

module.exports = {
  getErrorValue: function (req, res, _) {
    errorValue.getErrorValue()
      .then(data => res.status(200).send(data))
      .catch(error => {
        console.log(error);
        res.status(500).send(error);
      })
  },
};