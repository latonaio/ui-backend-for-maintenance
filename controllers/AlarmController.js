const alarm = require('../models/Alarms');

// 重故障, 軽故障, ユーザアラーム(システム）, ユーザアラーム(ユーザ), オフラインアラーム
const CATEGORIES = [1, 2, 3, 4, 5]

// とりあえずロボットID固定
const ROBOT_ID = 1;

module.exports = {
  getAlarm: function (req, res, _) {
    Promise.all(
      CATEGORIES.map(category => (
        alarm.get(ROBOT_ID, category)
      )))
      .then(data => {
        res.status(200).send(data);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send(error);
      })
  },
};
