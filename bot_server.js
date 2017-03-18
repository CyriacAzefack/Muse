
//Load required packages
var express = require('express');

var app = express();

//Generic PORT allocation 
app.listen(process.env.PORT || 5000, function () {

  console.log('Muse Server Started ...');
})

   
/*
##################
# Home call : /  #
##################
*/
.get('/', function (req, res) {
  res.send('Hello World!');

})

/*
#################################
# Webhook  GET call : /webhook  #
#################################
*/
.get('/webhook', function (req, res) {

  console.log(req.quey);
  if (req.query['hub.verify_token'] === 'facebook_token_on_muse_oklm') {
    res.send(req.query['hub.challenge']);
  } 
  else {
    res.send('Error, wrong validation token');    
  }
})

/*
##################################
# Webhook  POST call : /webhook  #
##################################
*/

.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } 

        else {
          console.log("Webhook received unknown event: ", event, 
            " at '", timeOfEvent, "'");
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});
  
function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  console.log("Message data: ", event.message);
}


