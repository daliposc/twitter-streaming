// Heavily inspired by http://ikertxu.tumblr.com/post/56686134143/nodejs-socketio-and-the-twitter-streaming-api

/** 
* Declare variables for server initilization
*
* @var fs The file system handler
* @var app The server app running
* @var io The Socket.IO handler
* @var theport The port that the app will listen on
* @var twitter The T for their Streaming API
**/
var fs = require("fs"),
	app = require("http").createServer(handler),
	io = require("socket.io").listen(app, {log: false}),
	theport = process.env.PORT || 2000;
	Twitter = require('node-tweet-stream');

// listens to the specified port
app.listen(theport);
console.log("http server on port: " + theport);

function handler(req, res) {
	fs.readFile(__dirname + "/index.html",
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end("Error loading index.html");
			}
			res.writeHead(200);
			res.end(data);
		});
}

/**
* Declare global variables for the server
*
* @var tw The Twitter streaming API initilization
* @var stream When a stream is created, this will be the only instance of it 
*             Done to avoids multiple users starting multiple streams
* @var track The tracking location for the stream
* @var users An array of users currently connected to the application
**/
var tw = new Twitter({
		consumer_key: "[CONSUMER_KEY]",
		consumer_secret: "[CONSUMER_SECRET]",
		token: "[TOKEN]",
		token_secret: "[TOKEN_SECRET]",
	}),
	stream = null,
	track = 'Trump',
	location = '-124.123,42.01,-117.026,46.273',
	users = [];

/**
* Listener for a client connection using sockets.io
**/
io.sockets.on("connection", function (socket) {
	// Add user to array if not already added
	if (users.indexOf("socket.id") === -1) {
		users.push(socket.id);
	}

	// Log
	logConnectedUsers();

	// Add a listener when the client/user emits a "start stream" signal
	socket.on("start stream", function() {
		console.log("===============STREAM STARTED=============")
		// The stream will be started only when the 1st user arrives
		if (stream === null) {
			//stream = tw.track(track);
			stream = tw.location(location);

			tw.on('tweet', function(tweet) {
				//only broadcast when users are online/a client is connected
				if (users.length > 0) {
					// Eemits the signal to all users but the one that started the stream
					socket.broadcast.emit("new tweet", tweet);
					socket.emit("new tweet", tweet);
					console.log(tweet.text);
				}
				else {
					//Don't run the stream if there are no users!
					stream = null;
				}
			});
		}
	});

	// Handle a user disconnect
	socket.on("disconnect", function(o) {
		// find disconnected user in array
		var index = users.indexOf(socket.id);
		if (index != -1) {
			// eliminate user from array
			users.splice(index, 1);
		}
		logConnectedUsers();
	});

	socket.emit("connected", {
		tracking: track
	});
});

// A log function for debugging purposes
function logConnectedUsers() {
    console.log("============= CONNECTED USERS ==============");
    console.log("==  ::  " + users.length);
    console.log("============================================");
};