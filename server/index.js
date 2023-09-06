const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

//const https  = require('https');
const http   = require('http');
const fs     = require('fs');
const cors   = require('cors');
const path   = require('path');
const app    = express();
const controller = require('./controller.js');

const dist = path.join(__dirname, '../client/dist');

app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

// var options = {
//   key:  fs.readFileSync(process.env.HTTPS_KEY),
//   cert: fs.readFileSync(process.env.HTTPS_CERT)
// };

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(dist));

app.post('/api/users', function(req, res) {
  controller.createUser(req, res);
});

app.get('/api/users/:uid', function(req, res) {
  controller.getUser(req.params.uid, res);
});

app.post('/api/communities', function(req, res) {
  controller.createCommunity(req, res);
});

app.get('/api/communities/:id', function(req, res) {
  controller.getCommunity(req.params.id, res);
});

app.get('/api/communities/find/:input', function(req, res) {
  controller.findCommunities(req.params.input, res);
});

const PORT = 4001;

http.createServer(app).listen(PORT);
//https.createServer(options, app).listen(443);
console.log(`Server listening at http://localhost:${PORT}`);
