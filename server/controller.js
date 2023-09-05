const axios    = require('axios');
const { User } = require('./db.js');

var controller = {
  createUser: function(req, res) {
    User.create(req.body)
      .then(function(response) {
        var user = parseUser(response);

        res.status(201);
        res.json(user);
      })
  },
  getUser: function(uid, res) {
    User.findOne({uid: uid})
      .then(function(response) {
        var user = parseUser(response);

        res.status(201);
        res.json(user);
      })
  }
};

var parseUser = function(doc) {
  var user = {
    uid:       doc.uid,
    username:  doc.username,
    email:     doc.email,

    firstName: doc.firstName || null,
    lastName:  doc.lastName  || null
  };

  return user;
};

var transform = function(doc) {
  var newDoc = {};

  for (var key in doc) {
    if (key !== '__v' && key !== '_id') {
      newDoc[key] = doc[key];
    }
  }

  return newDoc;
};

module.exports = controller;