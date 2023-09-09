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

app.post('/api/users', controller.createUser);
app.get('/api/users/:uid', controller.getUser);
app.post('/api/communities', controller.createCommunity);
app.get('/api/communities/:id', controller.getCommunity);
app.get('/api/communities/find/:input', controller.findCommunities);
app.post('/api/communities/join/', controller.joinRequest);
app.post('/api/communities/join/handle/', controller.handleJoinRequest);
app.post('/api/readNotifications/', controller.readNotifications);

app.get('/api/fix', controller.fix);

const PORT = 4001;

http.createServer(app).listen(PORT);
//https.createServer(options, app).listen(443);
console.log(`Server listening at http://localhost:${PORT}`);
