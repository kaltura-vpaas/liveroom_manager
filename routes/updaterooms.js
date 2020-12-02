var express = require('express');
var kaltura = require('kaltura-client');
var router = express.Router();

router.post('/', function(req, res, next) {
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

    var scheduleResource = new kaltura.objects.LocationScheduleResource();
    var rooms = JSON.parse(req.body.rooms);
    var arrayLength = rooms.updatedRooms.length;
    var numUpdatedRooms = 0;

    // Update the rooms
    for (var i = 0; i < arrayLength; i++) {
      console.log(rooms.updatedRooms[i]);
      scheduleResource.name = rooms.updatedRooms[i].name;
      scheduleResource.description = rooms.updatedRooms[i].description;
      scheduleResource.tags = rooms.updatedRooms[i].tags;

      // Either update or delete the rooms
      if (req.body.delete) {
        kaltura.services.scheduleResource.deleteAction(rooms.updatedRooms[i].id)
        .execute(client)
        .then(result => {
          console.log(result);

          // Send response after all rooms have completed deletion
          if (++numUpdatedRooms === arrayLength) {
            res.end();
          }
        });
      } else {
        kaltura.services.scheduleResource.update(rooms.updatedRooms[i].id, scheduleResource)
        .execute(client)
        .then(result => {
          console.log(result);

          // Send response after all rooms have completed updating
          if (++numUpdatedRooms === arrayLength) {
            res.end();
          }
        });
      }
    }
  })
  .execute(client);
});

module.exports = router;