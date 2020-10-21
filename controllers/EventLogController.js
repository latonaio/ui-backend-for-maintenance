const robot = require('../models/Robot');

module.exports = {
  getEventLog: function (req, res, _) {
    let sql =
      "select concat(                 " +
      "         even.name,            " +
      "         ' ',                  " +
      "         case elog.state       " +
      "           when 1 then 'オン'  " +
      "                  else 'オフ'  " +
      "         end                   " +
      "       )          Event,       " +
      "       created    Date         " +
      "from   event_logs elog         " +
      "inner                          " +
      "join   events     even         " +
      "on     even.id = elog.event_id " +
      "order                          " +
      "by     created desc            " +
      "limit  100                     ";
    robot.queryMysql(sql)
      .then(dataList => {
        res.status(200).send(dataList);
      })
      .catch(error => {
        res.status(500).send(error);
      });

    // // FOR DEBUG(DUMMY DATA)
    // res.status(200).send([
    //   {Event: "ストップ", Date: "2020/01/03 00:00:00"},
    //   {Event: "****モード", Date: "2020/01/02 00:00:00"},
    //   {Event: "スタート", Date: "2020/01/01 00:00:00"},
    // ]);
  },
};
