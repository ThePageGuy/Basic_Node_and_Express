let express = require('express');
let bodyParser = require('body-parser');
let app = express();
require('dotenv').config();

console.log("Hello World");

// Root-level request logger middleware
app.use(function(req, res, next) {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static assets from the /public directory
app.use('/public', express.static(__dirname + '/public'));

// Serve the index.html file for the root path
app.get('/', function(req, res) {
  let absolutePath = __dirname + '/views/index.html';
  res.sendFile(absolutePath);
});

// Serve JSON data at the /json route
app.get('/json', function(req, res) {
  let message = "Hello json";
  if (process.env.MESSAGE_STYLE === "uppercase") {
    message = message.toUpperCase();
  }
  res.json({"message": message});
});

// Chain middleware to create a time server
app.get('/now', function(req, res, next) {
  req.time = new Date().toString();
  next();
}, function(req, res) {
  res.json({time: req.time});
});

// Echo server route
app.get('/:word/echo', function(req, res) {
  let word = req.params.word;
  res.json({echo: word});
});

// API endpoint to respond with full name from query parameters
app.get('/name', function(req, res) {
  let firstName = req.query.first;
  let lastName = req.query.last;
  res.json({ name: `${firstName} ${lastName}` });
});

// POST handler to respond with full name from form data
app.post('/name', function(req, res) {
  let firstName = req.body.first;
  let lastName = req.body.last;
  res.json({ name: `${firstName} ${lastName}` });
});

module.exports = app;
