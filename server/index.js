const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

//const https  = require('https');
const http   = require('http');
const fs     = require('fs');
const cors   = require('cors');
const path   = require('path');
const app    = express();

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

const PORT = 4001;

http.createServer(app).listen(PORT);
//https.createServer(options, app).listen(443);
console.log(`Server listening at http://localhost:${PORT}`);
