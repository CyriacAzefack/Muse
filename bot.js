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

function handleWelcomeMessage(event) {
    const senderID = event.sender.id;
    let msg = "Bienvenue sur Muse4U! Mon seul et unique but est d'assouvir toutes tes envies musicales. \u000AUne chose à faire, tape le titre de la musique que tu veux écouter et laisse moi m'occuper du reste! \u000ASimple & Efficace!! \u000AEnjoy <3"
    facebook.replyMessage(senderID, msg);
}

//Describe how to handle a message
function handleMessage(event) {
	const senderID = event.sender.id;
	const messageText = event.message.text;
	const messageAttachments = event.message.attachments;


	if (messageText) { //Check if message is not empty
		facebook.replyMessage(senderID, "Recherche du titre '"+messageText+"' \u000AVeuillez patienter...")
        youtube.searchSong(messageText, function (results) {
            if (results) {
                const options = {
                    messageText: null,
                    title: results.songName,
                    mainUrl: results.youtubeUrl,
                    imageUrl: results.imageUrl,
                    buttonType: 'web_url',
                    buttonTitle: 'Télécharger l\'audio (mp3)',
                    buttonUrl: results.streamUrl,

                };
                facebook.replyButton(senderID, options);
                facebook.replyAudio(senderID, results.streamUrl)
            }
            else {
                facebook.replyMessage(senderID, ":'( :'( :'( :'( :'(");
                let msg = "Je suis désolé mais le titre '" + song.raw + "' n'a pas été trouvé. Veuillez essayer une orthographe différente!!";
                facebook.replyMessage(senderID, msg);
            }
        });

    }

	else if (messageAttachments) {
		facebook.replyMessage(senderID, 'Message with attachment received!! (Vocal recognition not implemented yet)');
	}
}


module.exports = {
	handleMessage,
    handleWelcomeMessage
};