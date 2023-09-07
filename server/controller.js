const axios    = require('axios');
const { User, Community } = require('./db.js');

var controller = {
  createUser: function(req, res) {
    User.create(req.body)
      .then(function(user) {
        res.json(user);
      })
  },
  getUser: function(req, res) {
    User.findOne({uid: req.params.uid})
      .then(function(user) {
        res.json(user);
      })
  },
  createCommunity: function(req, res) {
    Community.create(req.body.community)
      .then(function(response) {
        var community = response;

        res.json(community);

        User.findOneAndUpdate({uid: req.body.uid}, {community: community._id})
          .then(function(response) {
            console.log(response);
          })
      })
  },
  getCommunity: function(req, res) {
    Community.findOne({_id: req.params.id})
      .then(function(community) {
        res.json(community);
      })
  },
  findCommunities: function(req, res) {
    Community.find({private: false, name: {$regex: req.params.input}})
      .then(function(communities) {
        res.json(communities);
      })
  },
  joinRequest: function(req, res) {
    var user = req.body.user;
    var comm = req.body.community;
    var name = req.body.name;

    var request = {
      type: 'joinRequest',
      user: user
    };

    Community.findOneAndUpdate({_id: comm}, {$push: {notifications: request}})
      .then(function(response) {
        console.log('Join request sent.');
      });

    var notify = {
      type: 'joinRequest',
      community: comm,
      name: name,
      status: 'pending',
      read: false
    };

    User.findOneAndUpdate({uid: user}, {$push: {notifications: notify}}, {new: true})
      .then(function(user) {
        res.json(user);
      })
  }
};

module.exports = controller;