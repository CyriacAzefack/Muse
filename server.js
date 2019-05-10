
/*
#########################
# WELCOME TO MUSE Server #
#########################
*/



//Load required packages
var express = require('express');

var bodyParser = require('body-parser');

var request = require('request');

var bot = require('./bot.js');

var config = require('./config.json');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// For views display (html, css, ...)
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

//Generic PORT allocation 
app.listen(process.env.PORT || 5000, function () {
  console.log('Muse Server Started ...');
});

   
/*
###############
# INDEX  : /  #
###############
*/
app.get('/', function (req, res) {
  res.send('Welcome to the Muse Chat Bot :) !!');

})

/*
##############################################
# Webhook Subscribtion  GET call : /webhook  #
##############################################
*/
.get('/webhook', function (req, res) {

  console.log(req.quey);
  if (req.query['hub.verify_token'] === config.facebook.subscriptionToken) {
    res.send(req.query['hub.challenge']);
  } 
  else {
    res.send('Error, wrong validation token');    
  }
})

/*
##########################################
# Confidentiality Policy call : /policy  #
#########################################
*/
.get('/policy', function (req, res) {
  res.render('policy.html')
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
          bot.handleMessage(event);
        }
        else if(event.postback) {
          bot.handleWelcomeMessage(event);
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
  else {
    console.log("Webhooks Type  :::::")
    console.log(data.object)
  }
});





/*
######################
# sendGenericMessage #
#####################
*/
// Send a Generic message

function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Occulus RIFT",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",               
            image_url: "https://images-na.ssl-images-amazon.com/images/I/61ahfXnBa0L._SX522_.jpg",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",               
            image_url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTFlK3Y_9c10uyOlAACZE01UVF_3rYFLJhgmfQjiQJQ4BJBkObT1w",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}



