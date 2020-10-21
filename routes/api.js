const express = require('express');
const router = express.Router();
const {check} = require('express-validator/check');
const VerifyToken = require('../middlewares/verifyToken');

const userController = require('../controllers/UserController');
const chartController = require('../controllers/ChartController');
const dataBackupController = require('../controllers/DataBackupController');
const alarmController = require('../controllers/AlarmController');
const eventLogController = require('../controllers/EventLogController');
const offsetResultController = require('../controllers/OffsetResultController');
const operationTimeController = require('../controllers/OperationTimeController');
const softwareVersionController = require('../controllers/SoftwareVersionController');
const axesController = require('../controllers/AxesController');
const errorValueController = require('../controllers/ErrorValueController');
const orderLogController = require('../controllers/OrderLogController');
const robotHeaderController = require('../controllers/RobotHeaderController');
const jtektAlarmController = require('../controllers/JtektAlarmController');
const jobSchedulerController = require('../controllers/JobSchedulerController');
const collectionController = require('../controllers/CollectionController');
const deviceController = require('../controllers/DeviceController');
const readTriggerController = require('../controllers/ReadTriggerController');

router.post('/authenticate', [
  check('name').isLength({min: 1}),
  check('password').isLength({min: 5})
], userController.authenticate);
router.get('/me', VerifyToken, userController.me);

// Data
// TODO data -> yaskawa
router.get('/data/get/chart', chartController.getChartData);
router.get('/data/get/backup/:makerID', dataBackupController.getBackupDataList);
router.get('/data/get/alarm', alarmController.getAlarm);
router.get('/data/get/event', eventLogController.getEventLog);
router.get('/data/get/offset', offsetResultController.getOffset);
router.get('/data/get/operation', operationTimeController.getOperationTime);
router.get('/data/get/operationTime', operationTimeController._getOperationTime);
router.get('/data/get/startCollection', collectionController.startCollection);
router.get('/data/get/endCollection', collectionController.endCollection);
router.get('/data/get/soft', softwareVersionController.getSoftVersion);
router.get('/data/get/axes', axesController.getAxes);
router.get('/data/get/error_value', errorValueController.getErrorValue);
router.get('/data/get/order_log', orderLogController.getOrderLog);

router.get('/data/get/robot_name/:robotID', robotHeaderController.getRobotName);

router.get('/jtekt/get/alarm', jtektAlarmController.getAlarm);

router.get('/jobScheduler/getJob/:makerID', jobSchedulerController.getJob);
router.get('/jobScheduler/getMachine/:jobID', jobSchedulerController.getMachine);
router.post('/jobScheduler/setSchedule', jobSchedulerController.setSchedule);

router.post('/yaskawa/readTrigger/start', readTriggerController.start);
router.post('/yaskawa/readTrigger/stop', readTriggerController.stop);

router.get('/device/fetch', deviceController.fetchDevices);

module.exports = router;
