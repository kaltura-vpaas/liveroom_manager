var express = require('express');
var kaltura = require('kaltura-client');
var router = express.Router();

router.post('/', function (req, res, next) {
  const config = new kaltura.Configuration();
  config.serviceUrl = process.env.KALTURA_SERVICE_URL;
  const client = new kaltura.Client(config);
  const apiSecret = process.env.KALTURA_ADMIN_SECRET;
  const partnerId = process.env.KALTURA_PARTNER_ID
  const userId = process.env.KALTURA_USER_ID
  const type = kaltura.enums.SessionType.USER;

  // Generate KS
  kaltura.services.session.start(
    apiSecret,
    userId,
    type,
    partnerId)
    .completion((success, ks) => {
      if (!success) throw new Error(ks.message);
      client.setKs(ks);
      var room = JSON.parse(req.body.room);
      var scheduleResource = new kaltura.objects.LocationScheduleResource();
      scheduleResource.name = room.name;
      scheduleResource.description = room.desc;
      scheduleResource.tags = room.tags;

      // Either update or delete the rooms
      if (req.body.delete) {
        try {
          kaltura.services.scheduleResource.deleteAction(room.roomToUpdate)
            .execute(client)
            .then(result => {
              console.log(result);
              res.end();
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          kaltura.services.scheduleResource.update(room.roomToUpdate, scheduleResource)
            .execute(client)
            .then(result => {
              console.log(result);
              res.end();
            });
        } catch (error) {
          console.log(error);
        }
      }

    })
    .execute(client);
});

module.exports = router;