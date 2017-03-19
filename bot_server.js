
/*
##########################
# WELCOM TO MUSE AutoBot #
##########################
*/

// Connections Tokens
var SUB_TOKEN = "facebook_token_on_muse_oklm";
var PAGE_TOKEN = "EAAFvDZAesZCTsBAEaeSlGpetwu3wAsUScNSCfN2ALEZCAp8S4Qfro2U9bwm6GIPfcs2U47yqKIPozXeL2e5KSFDq2GfdCZCCBa8C6B4Upjef48hIsqacBVX20HuXNt1k1yZAQnSE0mkR9BeoCTe0jBPqsLVIcXSsHPJCeYkqbfAZDZD";


//Load required packages
var express = require('express');

var bodyParser = require('body-parser');

var request = require('request');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

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
  res.send('Hello World!');

})

/*
##############################################
# Webhook Subscribtion  GET call : /webhook  #
##############################################
*/
.get('/webhook', function (req, res) {

  console.log(req.quey);
  if (req.query['hub.verify_token'] === SUB_TOKEN) {
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
  

/*
###################
# ReceivedMessage #
###################
*/
// Function called when a message is received
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

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


/*
###################
# sendTextMessage #
###################
*/
//Send a message to a user
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}


/*
###############
# callSendAPI #
################
*/
//Call the SEND API
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else if (response.statusCode != 200) {
      console.error("Unable to send message. the response status is %s. Check the error details below...", response.statusCode);
      //console.error(response);
      console.error(error);
    }

    else {
      console.error("Unable to send message due to an unknown issue");
      console.error(error);
    }
  });  
}