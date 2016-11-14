var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/webhook', function(req, res) {

 if (req.query['hub.verify_token'] === 'EAAHvcZCfhP0sBAJr58UMXXbPrNtMg1lmpP34cVfrJNZBWWQUu7tm9XPG26z4MR0ZAljEjrFZAyLAUpJhONI9zZB7ORG0DbIyfdlmHWEeA9kZAlZBBhQgt4dSMtBoVUQfUcM9LwNaD2ZBURsYNDOSlL3N4xx1J3LcN9hztKAZC4ZCRrXgZDZD') {
   res.send(req.query['hub.challenge']);
 } else {
   res.send('Error, wrong validation token');
 }
});

router.post('/webhook', function (req, res) {
  const events = req.body.entry[0].messaging;
  var app = apiai("AI_SECRET");
  for (i = 0; i < events.length; i++) {
    const event = req.body.entry[0].messaging[i];
    const sender = event.sender.id;
    if (event.message && event.message.text) {
      const text = event.message.text;
      var airequest = app.textRequest(text);
      airequest.on('response', function(response) {
        console.log(response);
        sendTextMessage(sender, response.result.fulfillment.speech);
      });
      airequest.on('error', function(error) {
        console.log(error);
      });
      airequest.end();
    }
  }
  res.sendStatus(200);
});

//POST message
var request = require('request')

const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN


function sendTextMessage(sender, text) {
 request({
   url: 'https://graph.facebook.com/v2.6/me/messages',
   qs: {access_token: ACCESS_TOKEN},
   method: 'POST',
   json: {
     recipient: {id: sender},
     message: {text: text}
   }

 }, function(error, response, body) {
   if (error) {
     console.log('Error sending message: ', error);
   } else if (response.body.error) {
     console.log('Error: ', response.body.error);
   }
 });
}

module.exports = router;
