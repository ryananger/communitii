const axios    = require('axios');
const { User, Community } = require('./db.js');

var controller = {
  createUser: function(req, res) {
    User.create(req.body)
      .then(function(user) {
        res.status(201);
        res.json(user);
      })
  },
  getUser: function(uid, res) {
    User.findOne({uid: uid})
      .then(function(user) {
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
      .then(function(community) {
        res.status(201);
        res.json(community);
      })
  },
  findCommunities: function(input, res) {
    Community.find({private: false, name: {$regex: input}})
      .then(function(communities) {
        res.status(201);
        res.json(communities);
      })
  }
};

module.exports = controller;