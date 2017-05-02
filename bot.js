/*jshint esversion: 6 */

/*
###########################
# WELCOME TO MUSE Autobot #
###########################
*/



// Load required packages
var recastai = require('recastai');

var facebook = require('./facebook.js');

var spotify = require('./spotify.js');

var youtube = require('./youtube.js');

var config = require('./config.json');


var client = new recastai.Client(config.recastai.requestAccessToken, config.recastai.lang);

client.textConverse("Init").then(function(res) {});



console.log(client);


//Describe how to handle a message
function handleMessage(event) {
	const senderID = event.sender.id;
	const messageText = event.message.text;
	const messageAttachments = event.message.attachments;





	if (messageText) { //Check if message is not empty

		client.textConverse(messageText, { conversationToken: senderID}).then(function(res) {
			const reply = res.reply; 		//First reply of the bot
			let replies = res.replies;	//All the bot replies
			const action = res.action; 		// Get the current action
			const intents = res.intents;


            console.log(replies)


			//Promise : Asynchronous manager, replies to the bot
			let promise = Promise.resolve();
            promise = promise.then(function() {
			    replies.forEach(function(rep) {
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

			let action_slug = (action === null)? null: action.slug;

			if (action_slug === 'order-music') {
                let song = res.getMemory('song');

                if (song !== null) {

                    let singer = res.getMemory('singer');
					/*
					 if (singer === null) {
					 spotify.searchSong(song.raw, function(results) {

					 if (results) {
					 const options = {
					 messageText: null,
					 title: results.songName,
					 mainUrl: results.songUrl,
					 imageUrl: results.imageUrl,
					 buttonType: 'web_url',
					 buttonTitle: 'Ecouter un extrait',
					 buttonUrl: results.sampleUrl,


					 };
					 facebook.replyButton(senderID, options);
					 facebook.replyAudio(senderID, results.sampleUrl)
					 }
					 else {
					 facebook.replyMessage(senderID, ":'( :'( :'( :'( :'(");
					 let msg = "Je suis désolé mais le titre '" + song.raw + "' n'a pas été trouvé. Veuillez essayer une orthographe différente!!";
					 facebook.replyMessage(senderID, msg);
					 }
					 });
					 }

					 else {
					 spotify.searchSongAndArtist(song.raw, singer.raw,  function(results) {

					 if (results) {
					 const options = {
					 messageText: null,
					 title: results.songName,
					 mainUrl: results.songUrl,
					 imageUrl: results.imageUrl,
					 buttonType: 'web_url',
					 buttonTitle: 'Ecouter un extrait',
					 buttonUrl: results.sampleUrl,


					 };
					 facebook.replyButton(senderID, options);
					 facebook.replyAudio(senderID, results.sampleUrl)
					 }
					 else {
					 facebook.replyMessage(senderID, ":'( :'( :'( :'( :'(");
					 let msg = "Je suis désolé mais le titre '" + song.raw + "' du chanteur '"+singer.raw+"' n'a pas été trouvé. Veuillez essayer une orthographe différente!!";
					 facebook.replyMessage(senderID, msg);
					 }
					 });
					 }
					 */
                    //YOUTUBE SEARCH
                    var searchString = song.raw;
                    searchString += (singer === null) ? '' : singer.raw;

                    youtube.searchSong(searchString, function (results) {
                        if (results) {
                            const options = {
                                messageText: null,
                                title: results.songName,
                                mainUrl: results.songUrl,
                                imageUrl: results.imageUrl,
                                buttonType: 'web_url',
                                buttonTitle: 'Télécharger',
                                buttonUrl: results.sampleUrl,


                            };
                            facebook.replyButton(senderID, options);
                            facebook.replyAudio(senderID, results.sampleUrl)
                        }
                        else {
                            facebook.replyMessage(senderID, ":'( :'( :'( :'( :'(");
                            let msg = "Je suis désolé mais le titre '" + song.raw + "' n'a pas été trouvé. Veuillez essayer une orthographe différente!!";
                            facebook.replyMessage(senderID, msg);
                        }
                    });

                    //We reset the conversation
                    recastai.Conversation.resetMemory(config.recastai.requestAccessToken, senderID);


                }
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