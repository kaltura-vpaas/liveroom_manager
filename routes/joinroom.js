var express = require('express');
var kaltura = require('kaltura-client');
var router = express.Router();

router.post('/', function(req, res, next) {
  const config = new kaltura.Configuration();
  config.serviceUrl = process.env.KALTURA_SERVICE_URL;
  const client = new kaltura.Client(config);
  const apiSecret = process.env.KALTURA_ADMIN_SECRET;
  const partnerId = process.env.KALTURA_PARTNER_ID
  const expiry = process.env.LIVEROOM_SESSION_DURATION
  const type = kaltura.enums.SessionType.USER;

  let resourceId = req.body.resourceId;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let userId = firstName + "." + lastName + "@somedomain.com"; // using email as userId, but it can be any alphanumeric unique string

  // Set priveleges parameter for Kaltura Session (KS) generation.
  // For userContextual role:
  //   0 = admin
  //   3 = guest
  // Mandatory fields: role, userContextualRole, resourceId (or eventId)
  let userContextualRole = req.body.role == "admin" ? "0" : "3";
  let privileges = "role:viewerRole,userContextualRole:" + userContextualRole + ",resourceId:" + resourceId + 
    ",firstName:" + firstName + ",lastName:" + lastName + ",email:" + userId;

  // Generate KS
  kaltura.services.session.start(
    apiSecret,
    userId,
    type,
    partnerId,
    expiry,
    privileges)
    .execute(client)
    .then(result => {
      // Pass the generated url back to caller in order for it to be rendered
      let roomUrl = "https://" + partnerId + ".kaf.kaltura.com/virtualEvent/launch?ks=" + result;
      console.log("JOIN URL: "+ roomUrl);
      res.end(roomUrl);
    });
});

module.exports = router;