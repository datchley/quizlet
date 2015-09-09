var express = require('express'),
    morgan = require('morgan'),
    quizlet = require('./middleware.js'),
    app = express();

// Serve all static files from 'build/` dir
app.use(express.static('build'));

// console.logging requests in development
app.use(morgan('dev'));

// set a port to listen on 
var port = process.env.port || 8181;

// Setup Quizlet API route middleware
app.use('/api', quizlet);

app.listen(port, function() {
    console.log("server listening on port:", port);
});
