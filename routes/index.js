var express = require('express');
var kaltura = require('kaltura-client');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  // Create Kaltura client
  const config = new kaltura.Configuration();
  config.serviceUrl = process.env.KALTURA_SERVICE_URL;
  const client = new kaltura.Client(config);
  const apiSecret = process.env.KALTURA_ADMIN_SECRET;
  const partnerId = process.env.KALTURA_PARTNER_ID;
  const userId = process.env.KALTURA_USER_ID;
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

    // Get list of resources
    let filter = new kaltura.objects.ScheduleResourceFilter();
    let pager = new kaltura.objects.FilterPager();
    pager.pageSize = 500;
    kaltura.services.scheduleResource.listAction(filter, pager)
    .execute(client)
    .then(result => {
        console.log(result);
        res.render('index', { title: 'virtual room manager', resources: result.objects });
    });
  })
  .execute(client);

  /* TEST DATA
  var resources = [ { id: 123, name: "Room 1", description: "First room",  tags: "vcprovider:newrow" },
                    { id: 456, name: "Room 2", description: "Second room", tags: "vcprovider:newrow" },
                    { id: 789, name: "Room 3", description: "Third room",  tags: "vcprovider:newrow" }
                  ];
  res.render('index', { title: 'virtual room manager', resources: resources });
  */
});

module.exports = router;
