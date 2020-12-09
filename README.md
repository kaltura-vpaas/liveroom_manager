A manager app for live rooms

1. Clone this github repository
2. run npm install
3. edit .env with:

```
SESSION_SECRET= #Key used for encrypting session cookies  
KALTURA_SERVICE_URL=https://www.kaltura.com 
KALTURA_ADMIN_SECRET= #obtained from https://kmc.kaltura.com/index.php/kmcng/settings/integrationSettings 
KALTURA_PARTNER_ID=#obtained from https://kmc.kaltura.com/index.php/kmcng/settings/integrationSettings 
KALTURA_USER_ID=#set it to the Kaltura user designated as admin. This is usually the email address you used to create your Kaltura account 
LIVEROOM_SESSION_DURATION=86400
```
