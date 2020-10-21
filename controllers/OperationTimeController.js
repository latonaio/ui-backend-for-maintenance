const robot = require('../models/Robot');
const command = require('../constants/command.constants');
const ARRAY_NO_LIST = [
  1,   // 制御電源投入時間
  10,  // サーボ電源投入時間
  110, // プレイバック時間(TOTAL)
  210, // 移動時間(TOTAL)
  301, // 作業時間(用途1)
];

// ISSUE 全コマンドが同じRedis keyを使う
const COMMAND_KEY = "kanban:after:control-yaskawa-robot-r:001"

module.exports = {
  getOperationTime: function (req, res, _) {
    Promise.all(
      ARRAY_NO_LIST.map(arrayNo => (
        robot.getRedis(command.OPERATION_TIME, arrayNo, 1)
          .then(data => data[0])
      )))
      .then(data => {
        hash = {};
        data.forEach(value => {
          hash[parseInt(value["ArrayNo"])] = value;
        });
        res.status(200).send(hash);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send(error);
      })
    //   [
    //     {
    //       ArrayNo: 1,
    //       ElapsedTime: "2020/01/01 00:00:01",
    //       StartTime: "0: 4' 6",
    //     },
    //     {
    //       ArrayNo: 10,
    //       ElapsedTime: "2020/01/01 00:00:02",
    //       StartTime: "0: 1'39",
    //     },
    //     ...
    //   ]
    //     ↓
    //   {
    //     1: {
    //       ElapsedTime: "2020/01/01 00:00:01",
    //       StartTime: "0: 4' 6",
    //     },
    //     10: {
    //       ElapsedTime: "2020/01/01 00:00:02",
    //       StartTime: "0: 1'39",
    //     },
    //     ...
    //   }

  },
  _getOperationTime: function (req, res, _) {
    robot.getKanbanRedis(COMMAND_KEY, 1)
      .then(data => {
        console.log(data);
        if (data.length > 0) {
          let metadata = data[0][1][1];
          console.log(metadata);
          return (metadata);
        } else {
          return ([]);
        }
      })
      .then(metadata => {
        // Fixme: format metadata
        res.status(200).send(metadata);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send(error);
      });
  }
};
