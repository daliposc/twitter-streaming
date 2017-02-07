# twitter-streaming
Streams live tweets in (and around) Oregon using Node.js, sockets.io, Leaflet, and Heroku (to do all the publishing for me)

Files:
 * *Procfile*: Defines the process for Heroku deployment
 * *app.js*: Server-side Node.js for handling twitter streaming requests
 * *index.html*: Includes client side javascript for updating the DOM with new tweets
 * *package.json*: Have npm to handle all of the dependency instillations for the Node.js application (super handy!)

See the live demo here: http://twitter-streaming-tut.herokuapp.com/

Heavily inspired by: http://ikertxu.tumblr.com/post/56686134143/nodejs-socketio-and-the-twitter-streaming-api
