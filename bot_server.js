var express = require('express');

var app = express();

app.listen(process.env.PORT || 5000, function () {

  console.log('Muse Server Started ...');
});

   
//Diffents call
app.get('/', function (req, res) {
  res.send('Hello World!');

});


app.get('/webhook', function (req, res) {

  console.log(req.quey);
  if (req.query['hub.verify_token'] === 'facebook_token_on_muse_oklm') {
    res.send(req.query['hub.challenge']);
  } 
  else {
    res.send('Error, wrong validation token');    
  }
  });


