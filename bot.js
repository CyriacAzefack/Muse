/*jshint esversion: 6 */

/*
##########################
# WELCOM TO MUSE Autobot #
##########################
*/



// Load required packages
var recastai = require('recastai');

var facebook = require('./facebook.js');

var config = require('./config.json');


var client = new recastai.Client(config.recastai.requestAccessToken, config.recastai.lang);





console.log(client);


//Describe how to handle a message
function handleMessage(event) {
	const senderID = event.sender.id;
	const messageText = event.message.text;
	const messageAttachments = event.message.attachments;
	
	client.textConverse("Init").then(function(res) {});
	
	if (messageText) { //Check if message is not empty

		client.textConverse(messageText, { conversationToken: senderID}).then(function(res) {
			const reply = res.reply; 		//First reply of the bot
			var replies = res.replies;	//All the bot replies
			const action = res.action; 		// Get the current action
			const intents = res.intents;

					
			intents.forEach(function(intent) {
				
				if (intent.slug === 'greetings' && intent.confidence > 0.6) {
	      			// Do your code
	      			console.log("Reset Memory !!");
	      			Conversation.resetMemory(config.recastai.requestAccessToken, senderID);

	      			client.textConverse(messageText, { conversationToken: senderID}).then(function(res) {
	      				replies = res.replies;

	      			});
    			}
			});

			
			
			if(messageText === "Test button") {
				const options = {
					messageText: null,
					title: 		'Kidogo -- Diamond Platnumz',
					imageUrl: 	'http://www.kizobrax.net/wp-content/uploads/2016/06/diamond-platnumz-and-p-square.jpg',
					buttonType: 'web_url',
					buttonTitle:'Listen on Spotify',
					buttonUrl: 	'https://play.spotify.com/album/3XBqlfR8vyCsbj2n9Ig6nH',
				};

				facebook.replyButton(senderID, options);
			}

			else {
				//Promise : Asynchronous manager
				let promise = Promise.resolve();
				replies.forEach(function(rep) {
					promise = promise.then(function() {
						facebook.replyMessage(senderID, rep).catch(function(err) {
							console.error("Failed sending : %s", rep);
							console.error(err);
						});

					});
				});

				promise.then(function() {
					console.log("Messages sending...");
				}). catch(function(err) {
					console.error("Message to '%s' Failed!! Check the logs for more details", senderID);
					console.error(err);
				});
			}
		}).catch(function(err) {
			console.error("RecastAI conversation failed!! Check the logs for more details");
			console.error(err);
		});

		
	}

	else if (messageAttachments) {
		facebook.replyMessage(senderID, 'Message with attachment received!! (Vocal recognition not implemented yet)');
	}
}




module.exports = {
	handleMessage
};