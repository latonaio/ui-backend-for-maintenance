const path = require('path');
const dateFormat = require('dateformat');
const directoryConstants = require('../constants/directory.constants');
const fs = require('fs');

// ISSUE 全コマンドが同じRedis keyを使う
const COMMAND_KEY = "kanban:after:control-yaskawa-robot-r:001"

module.exports = {
  startCollection: function (req, res, _) {
    const deviceName = process.env.DEVICE_NAME
    const target = 'get-robot-data-triggered-by-ui'
    const now = new Date();
    const directNextJson = {
      connections: {
        [target]: {
          deviceName: deviceName,
          outputDataPath: path.join("/var/lib/aion/Data", target + "_1"),
          metadata: {
            add_list: directoryConstants.addList
          }
        }
      }
    };

    console.log(directNextJson);
    try {
      let outpath = outputJsonFile(directNextJson, target, now);
      res.status(200).send(outpath);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  endCollection: function (req, res, _) {
    const deviceName = process.env.DEVICE_NAME
    const target = 'get-robot-data-triggered-by-ui'
    const now = new Date();
    const directNextJson = {
      connections: {
        [target]: {
          deviceName: deviceName,
          outputDataPath: path.join("/var/lib/aion/Data", target + "_1"),
          metadata: {
            remove_list: directoryConstants.removeList
          }
        }
      }
    };
    
    console.log(directNextJson);
    try {
      let outpath = outputJsonFile(directNextJson, target, now);
      res.status(200).send(outpath);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
};

const outputJsonFile = (data, prefix, now) => {
  if (now === undefined) {
    now = new Date();
  }
  console.log("call outputJsonFile");
  const outputPath = directoryConstants.jsonOutputDir + '/'
    + prefix + '_' + dateFormat(now, "yyyymmddHHMMssl") + '.json';
  console.log(outputPath);
  try {
    console.log(data);
    console.log(JSON.stringify(data,null,4));
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 4));
    console.log("Successfully Written to " + outputPath);
    return outputPath;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
