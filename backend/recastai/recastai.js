// BOT PARAMETERS
var TOKEN = "f94c8c573831b41b1812b12a72ce618a";
var LANGUAGE = "fr";

// Load required packages
var recastai = require('recastai');

var client = new recastai.Client(TOKEN, LANGUAGE);

var conversation = null;

console.log(client);


/*
client.textRequest("Je veut écouter papoutai")
	.then(function(res) {
		// get the intent detected
		var intent = res.intent();
			
		console.log(res.get('song'));
		// get all the location entities extracted from your text
		var locations = res.all('location');

		// Do your code
	}).catch(function(err) {
		// Handle error
		console.log("error : %s", error);
	});

*/
var prompt = require('prompt');

prompt.start();

var conversation_token = null;

// Init the conversation
client.textConverse("xxxx").then(function(res) {
	conversation_token = res.conversation_token;

	prompt.get(['user_msg'], getUserMessage);
})
.catch(function(err) {
	onError(err);
});





function getUserMessage(err, result) {
	if (err) { return onErr(err); }
	console.log('Command-line input received:');
	console.log('\tUsr Message: ' + result.user_msg);

	client.textConverse(result.user_msg, { conversationToken : conversation_token})
	  .then(function(res) {


		var reply = res.reply();


		console.log('\tBot Message: ' + reply);

		var action = res.nextAction();

		console.log('\tBot Message: ' + action.reply);

		if(!action.done)
			prompt.get(['user_msg'], getUserMessage);

	})
	  .catch(function(err) {
		onError(err);
	});


}


function onErr(err) {
	console.error(err);
	return 1;
}