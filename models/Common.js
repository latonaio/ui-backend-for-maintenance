const robot = require('./Robot');
const command = require('../constants/command.constants');

const ARRAY_NO_LIST = [
  11,
  101,
];

module.exports = {
  getSystemInfo: function () {
    return new Promise((resolve, reject) => {
      Promise.all(
        ARRAY_NO_LIST.map(arrayNo => (
          robot.getRedis(command.SYSTEM_INFORMATION, arrayNo, 1)
            .then(data => data[0])
        ))
      )
        .then(data => {
          let hash = {};
          data.forEach(d => {
            if (d !== undefined) {
              switch (parseInt(d.ArrayNo)) {
                case 11:
                  hash["SystemSoftwareVersion"] = d.SystemVersion;
                  hash["MachineName"] = d.ControllerName;
                  hash["ParameterVersion"] = d.ParameterVersion;
                  break;
                case 101:
                  hash["PurposeName"] = d.ControllerName;
                  break;
              }
            }
          });
          resolve(hash);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        })
    });
  },
  getAxesInfo: function () {
    return new Promise((resolve, reject) => {
      robot.getRedis(command.AXES_DATA, 101)
        .then(data => {
          resolve(data[0]);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        })
    })
  },
};
