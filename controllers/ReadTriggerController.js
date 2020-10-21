const fs = require('fs');
const path = require('path');
const dateFormat = require('dateformat');

const directoryConstants = require('../constants/directory.constants');
const commandConstants = require('../constants/command.constants');

const ARRAY_LIST_ALARM = [
  {
    "command": "71",
    "arrayNo": [
      "1","2","3","4","5","6","7","8","9","10",
      "1001","1002","1003","1004","1005","1006","1007","1008","1009","1010",
      "2001","2002","2003","2004","2005","2006","2007","2008","2009","2010",
      "3001","3002","3003","3004","3005","3006","3007","3008","3009","3010",
      "4001","4002","4003","4004","4005","4006","4007","4008","4009","4010"
    ]
  }
]
const ARRAY_LIST_AXES = [
  {
    "command": "74",
    "arrayNo": [
      "101"
    ]
  }
]
const ARRAY_LIST_POSITION = [
  {
    "command": "75",
    "arrayNo": [
      "101"
    ]
  }
]
const ARRAY_LIST_TORQUE = [
  {
    "command": "77",
    "arrayNo": [
        "1"
    ]
  }
]
const ARRAY_LIST_SIGNAL = [
  {
    "command": "78",
    "arrayNo": [
        "1001",
        "1008",
        "5008"
    ]
  }
]
const ARRAY_LIST_REGISTER = [
  {
    "command": "79",
    "arrayNo": [
    ]
  }
]
const ARRAY_LIST_OPERATION = [
  {
    "command": "88",
    "arrayNo": [
      "1",
      "10",
      "110",
      "210",
      "301"
    ]
  }
]
const ARRAY_LIST_INFORMATION = [
  {
    "command": "89",
    "arrayNo": [
      "11",
      "101"
    ]
  }
]

module.exports = {
  start: function (req, res, _) {
    const target = 'get-robot-data-triggered-by-ui';
    const command = req.body.data.command;
    const directNextJson = generateDirectNextJson(target, true, command);
    outputJsonFile(directNextJson, target);
    console.log('call core backend');
    res.status(200).send({success: true});
  },
  stop: function (req, res, _) {
    const target = 'get-robot-data-triggered-by-ui';
    const command = req.body.data.command;
    const directNextJson = generateDirectNextJson(target, false, command);
    outputJsonFile(directNextJson, target);
    console.log('call core backend');
    res.status(200).send({success: true});
  }
};

function generateDirectNextJson(target, isAdd, command) {  
  const deviceName = process.env.DEVICE_NAME
  const operation = isAdd ? "add_list" : "remove_list";

  let commandList = [];
  switch (command) {
    case commandConstants.ALARM_DATA:
      commandList = ARRAY_LIST_ALARM;
      break;
    //case commandConstants.AXES_DATA:
    //  commandList = ARRAY_LIST_AXES;
    //  break;
    case commandConstants.POSITION_DATA:
      commandList = ARRAY_LIST_POSITION;
      break;
    case commandConstants.TORQUE_DATA:
      commandList = ARRAY_LIST_TORQUE;
      break;
    case commandConstants.SIGNAL_DATA:
      commandList = ARRAY_LIST_SIGNAL;
      break;
    case commandConstants.REGISTER_DATA:
      commandList = ARRAY_LIST_REGISTER;
      break;
    case commandConstants.OPERATION_TIME:
      commandList = ARRAY_LIST_OPERATION;
      break;
    case commandConstants.SYSTEM_INFORMATION:
      commandList = ARRAY_LIST_INFORMATION;
      break;
  }

  return {
    connections: {
      [target]: {
        deviceName: deviceName,
        outputDataPath: path.join("/var/lib/aion/Data", target + "_1"),
        metadata: {
          [operation]: commandList 
        }
      }
    }
  }
}

const outputJsonFile = (data, prefix, now) => {
  if (now === undefined) {
    now = new Date();
  }
  const outputPath = directoryConstants.jsonOutputDir + '/'
    + prefix + '_' + dateFormat(now, "yyyymmddHHMMssl") + '.json';

  try {
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 4));
    console.log("Successfully Written to " + outputPath);
    return outputPath;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

