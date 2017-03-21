/*jshint esversion: 6 */
/*
###############################
# WELCOM TO MUSE on Messenger #
###############################
*/

var request = require('request');

var config = require('./config.json');

/*
	Call the Facebook API to send a message
*/
function sendMessage(messageData) {
	return new Promise(function(resolve, reject) {
		request({
			uri: 'https://graph.facebook.com/v2.6/me/messages',
			qs: { acces_token: config.facebook.pageAccessToken},
			method: 'POST',
			json: messageData,
		}, function(error, response) {
			if(!error && response.statusCode === 200) {
				console.log('Message sent!!');
				resolve();
			}
			else if (error) {
				reject(error);
			}
			else {
				reject(response)
			}
		});
	});
}

/*
* Simple text message
*/
function replyMessage(recipientID, messageText) {
	return new Promise(function(resolve, reject) {
		const messageData = {
			recipient: {
				id: recipientID,
			},
			message: {
				text: messageText,
			},
		};

		sendMessage(messageData).then(function() {
			resolve();
		}).catch(function(err) {
			reject(err);
		});
	});
}

/*
* Send a button
*/
function replyButton(recipientID, option) {
	const messageData = {
		recipient: {
			id: recipientID, 
		},
		message: {
			attachment: {
				type: 'template',
				payload: {
					template_type: 'generic',
					elements: [{
						title: option.title,
						subtitle: "Generated by Muse Auto bot",
						image_url: option.imageUrl,
						buttons: [{
							type: option.buttonType,
							url: option.buttonUrl,
							title: option.buttonTitle
						}],
					}],
				},
			},
		},
	};

	sendMessage(messageData);
}

module.exports = {
  replyMessage,
  replyButton,
}