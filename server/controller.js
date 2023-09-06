const axios    = require('axios');
const { User, Community } = require('./db.js');

var controller = {
  createUser: function(req, res) {
    User.create(req.body)
      .then(function(response) {
        var user = response;

        res.status(201);
        res.json(user);
      })
  },
  getUser: function(uid, res) {
    User.findOne({uid: uid})
      .then(function(response) {
        var user = response;

        res.status(201);
        res.json(user);
      })
  },
  createCommunity: function(req, res) {
    Community.create(req.body.community)
      .then(function(response) {
        var community = response;

        res.status(201);
        res.json(community);

        User.findOneAndUpdate({uid: req.body.uid}, {community: community._id})
          .then(function(response) {
            console.log(response);
          })
      })
  },
  getCommunity: function(id, res) {
    Community.findOne({_id: id})
      .then(function(response) {
        var community = response;

        res.status(201);
        res.json(community);
      })
  }
};

module.exports = controller;