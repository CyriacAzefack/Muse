/*jshint esversion: 6 */

/*
###########################
# WELCOME TO MUSE Autobot #
###########################
*/



// Load required packages
let recastai = require('recastai');

let facebook = require('./facebook.js');

let spotify = require('./spotify.js');

let config = require('./config.json');


let client = new recastai.Client(config.recastai.requestAccessToken, config.recastai.lang);

client.textConverse("Init").then(function(res) {});



console.log(client);


//Describe how to handle a message
function handleMessage(event) {
	const senderID = event.sender.id;
	const messageText = event.message.text;
	const messageAttachments = event.message.attachments;


	

	
	if (messageText) { //Check if message is not empty

        // We check the intent of the user message and set the memory accordingly
        client.textConverse(messageText, {conversationToken: senderID}).then(function (res) {
            const action = res.action;

            const regex = new RegExp('\".*\"');

            if (regex.test(messageText)) { //if the message contains double quotes

                let value = messageText.match(new RegExp(regex))[0];

                //remove double quotes
                value = value.replace(/['"]+/g, '');


                var song = res.getMemory('song');
                if (song != null) {
                    song = song.value;
                }

                var singer = res.getMemory('singer');
                if (singer != null) {
                    singer = singer.value;
                }

                if (action) { //If an action is detected
                    if (action.slug === "order-music") {

                        recastai.Conversation.setMemory(config.recastai.requestAccessToken, senderID,
                            {
                                song: {value: value},
                                singer: {value: singer}
                            }
                        );
                    }
                    else if (action.slug === "order-artist") {
                        recastai.Conversation.setMemory(config.recastai.requestAccessToken, senderID,
                            {
                                song: {value: song},
                                singer: {value: value}
                            }
                        );
                    }

                }
                else if (action.slug === "greetings") {
                    recastai.Conversation.resetMemory(config.recastai.requestAccessToken, senderID);
                }
            }


            //Converese with the bot with the right status of the memory
            client.textConverse(messageText, {conversationToken: senderID}).then(function (res) {
                //const reply = res.reply; 		//First reply of the bot
                const replies = res.replies;	//All the bot replies
                const action = res.action; 		// Get the current action
                //const intents = res.intents;


                if (messageText === "Reset") {
                    recastai.Conversation.resetMemory(config.recastai.requestAccessToken, senderID);
                    facebook.replyMessage(senderID, "Conversation  remise à zero");
                }
                else if (messageText === "Test button") {
                    const options = {
                        messageText: null,
                        title: 'Kidogo -- Diamond Platnumz',
                        mainUrl: 'www.google.com',
                        imageUrl: 'http://www.kizobrax.net/wp-content/uploads/2016/06/diamond-platnumz-and-p-square.jpg',
                        buttonType: 'web_url',
                        buttonTitle: 'Listen on Spotify',
                        buttonUrl: 'https://play.spotify.com/album/3XBqlfR8vyCsbj2n9Ig6nH',
                    };

                    facebook.replyButton(senderID, options);
                }

                else {




                    //Promise : Asynchronous manager
                    let promise = Promise.resolve();
                    replies.forEach(function (rep) {
                        promise = promise.then(function () {
                            facebook.replyMessage(senderID, rep).catch(function (err) {
                                console.error("Failed sending : %s", rep);
                                console.error(err);
                            });

                        });
                    });

                    promise.then(function () {
                        console.log("Messages sending...");
                    }).catch(function (err) {
                        console.error("Message to '%s' Failed!! Check the logs for more details", senderID);
                        console.error(err);
                    });
                }

                if (action.slug === "order-artist" && action.done) {
                    let song = res.getMemory('song');
                    let artist = res.getMemory('singer');

                    if ((song !== null) && (artist !== null) && (action) && (action.done)) {

                        song = song.raw;
                        artist = artist.raw;
                        spotify.searchSongAndArtist(song, artist, function (urls) {
                            const options = {
                                messageText: null,
                                title: song.raw + " -- " + artist,
                                mainUrl: urls.song,
                                imageUrl: urls.image,
                                buttonType: 'web_url',
                                buttonTitle: 'Ecouter un extrait',
                                buttonUrl: urls.sample,
                            };
                            facebook.replyButton(senderID, options);
                        });

                    }
                }

            }).catch(function (err) {
                console.error("RecastAI conversation failed!! Check the logs for more details");
                console.error(err);
            });
        }).catch(function (err) {
            console.error("Check Intent ont RecastAI conversation failed!! Check the logs for more details");
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