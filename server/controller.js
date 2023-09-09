const axios    = require('axios');
const pusher = require('./pusher.js');
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

        User.findOne({uid: req.body.uid})
          .then(function(user) {
            var update = {
              notifications: [],
              community: community._id
            };

            if (user.notifications) {
              user.notifications.map(function(notificaton) {
                if (notificaton.type !== 'joinRequest') {
                  update.notifications.push(notificaton);
                }
              })
            }

            User.findOneAndUpdate(user, update, {new: true})
              .then(function(user) {
                res.json(user);
              })
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
    Community.find({private: false, name: {$regex: req.params.input, $options: 'i'}})
      .then(function(communities) {
        res.json(communities);
      })
  },
  joinRequest: function(req, res) {
    var user = req.body.user;
    var username = req.body.username;
    var comm = req.body.community;
    var name = req.body.name;

    var request = {
      type: 'joinRequest',
      uid: user,
      username: req.body.username
    };

    Community.findOneAndUpdate({_id: comm}, {$push: {notifications: request}}, {new: true})
      .then(function(community) {
        pusher.trigger(`${comm}`, 'adminUpdate', community.notifications);

        console.log('Join request sent.');
      });

    var notify = {
      type: 'text',
      text: `A request to join "${name}" has been sent.`
    };

    User.findOneAndUpdate({uid: user}, {$push: {notifications: notify}}, {new: true})
      .then(function(user) {
        res.json(user);
      })
  },
  handleJoinRequest: function(req, res) {
    var type = req.body.type;
    var uid = req.body.uid;
    var username = req.body.username;
    var comm = req.body.comm;
    var name = req.body.name;

    if (type === 'yes') {
      var userNotify = {type: 'text', text: `Your request to join "${name}" has been approved.`};
      var update = {
        community: {$push: {members: {admin: false, uid}}},
        user: {community: comm, $push: {notifications: userNotify}}
      };

      Community.findOne({comm})
        .then(function(community) {
          var newNotifications = [];

          community.notifications.map(function(entry) {
            if (entry.type !== 'joinRequest') {
              newNotifications.push(entry);
            } else if (entry.uid !== uid) {
              newNotifications.push(entry);
            }
          })

          newNotifications.push({type: 'text', text: `${username} has joined the community!`});
          update.community.notifications = newNotifications;

          Community.findOneAndUpdate(community, update.community, {new: true})
            .then(function(updated) {
              User.findOneAndUpdate({uid}, update.user, {new: true})
                .then(function(user) {
                  pusher.trigger(`${uid}`, 'userUpdate', {user, update: userNotify});
                  pusher.trigger(`${comm}`, 'adminUpdate', updated.notifications);
                  res.json(updated);
                })
            })
        })

    } else {
      var userNotify = {type: 'text', text: `Your request to join "${name}" has been denied.`};
      var update = {$push: {notifications: userNotify}};

      Community.findOne({comm})
        .then(function(community) {
          var newNotifications = [];

          community.notifications.map(function(entry) {
            if (entry.type !== 'joinRequest') {
              newNotifications.push(entry);
            } else if (entry.uid !== uid) {
              newNotifications.push(entry);
            }
          })

          Community.findOneAndUpdate(community, {notifications: newNotifications}, {new: true})
            .then(function(updated) {
              User.findOneAndUpdate({uid}, update, {new: true})
                .then(function(user) {
                  pusher.trigger(`${uid}`, 'userUpdate', {user, update: userNotify});
                  res.json(updated);
                })
            })
        })
    }
  },
  readNotifications: function(req, res) {
    User.findOne({uid: req.body.uid})
      .then(function(user) {
        user.notifications.map(function(entry) {
          entry.read = true;
        })

        User.findOneAndUpdate({uid: user.uid}, user)
          .then(function(updated) {
            res.send(user);
          })
      })
  },
  fix: function(req, res) {
    Community.deleteMany({})
      .then(function(response) {
        console.log(response);
      })

    User.updateMany({}, {community: null, notifications: []})
      .then(function(response) {
        console.log(response);

        res.send('yay');
      })
  }
};

module.exports = controller;