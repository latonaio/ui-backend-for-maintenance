const device = require('../models/Device/Device');
const databackup = require('../models/Backupfiles');

module.exports = {
  getBackupDataList: async function (req, res, _) {
    const maker_id = req.params.makerID;

    device.getByMakerID(maker_id)
      .then(
        devices => Promise.all(
          devices.map(d =>
            Promise.all([
              d,
              databackup.getByMacAddress(d.macAddress),
            ]).then(dd => ({device: dd[0], backup: dd[1]}))
          )
        )
      )
      .then(result => res.status(200).send(result))
      .catch(error => {
          console.log(error);
          res.status(500).send(error);
        }
      )
  },
};
