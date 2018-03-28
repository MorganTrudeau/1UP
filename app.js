var express = require('express');
var path = require('path');
var app = express();

// Define the port to run on
app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'build')));

require('./app/javascripts/app.js')(app);

app.get('*', (req res) => {
	res.sendFile(path.resolve(_dirname, 'index.html'));
});

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});