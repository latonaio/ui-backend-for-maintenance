require('dotenv').config();
const path = require('path');

const userName = process.env.USER;
const deviceName = process.env.DEVICE_NAME;

module.exports = {
  runtimeDir: `/home/${userName}/${deviceName}/Runtime`,
  jsonOutputDir: process.env.JSON_OUTPUT_DIR || `/var/lib/aion/Data/direct-next-service_1`,
  uiDir: path.dirname(__dirname), // /constantsからこのファイルを移動させる場合はこの部分を適宜修正
  addList: [
    { "command": "88", "arrayNo": ["1", "10", "110", "210", "301"]}
  ],
  removeList: [
    { "command": "88", "arrayNo": ["1", "10", "110", "210", "301"]}
  ]
};
