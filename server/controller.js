const axios    = require('axios');
const pusher = require('./pusher.js');
const { User, Community, Post } = require('./db.js');

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
      .lean()
      .then(function(community) {
        var promises = [];
        var newFeeds = {};

        var getPost = function(feed, ids, resolve) {
          Post.findOne({_id: ids[feed.length]})
            .populate('user')
            .then(function(post) {
              feed.push(post);

              if (feed.length < ids.length) {
                getPost(feed, ids, resolve);
              } else {
                resolve();
              }
            })
        };

        for (var key in community.feeds) {
          newFeeds[key] = [];

          var ids = community.feeds[key];
          var start = ids[0];

          var promise = new Promise(function(resolve) {
            getPost(newFeeds[key], ids, resolve);
          });

          promises.push(promise);
        }

        Promise.all(promises)
          .then(function() {
            community.feeds = newFeeds;

            res.json(community);
          })
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

  updateSettings: function(req, res) {
    User.findOneAndUpdate({uid: req.body.uid}, {settings: req.body.settings}, {new: true})
      .then(function(user) {
        res.json(user.settings);
      })
  },
  submitPost: function(req, res) {
    const post = req.body;
    const uid  = post.user.uid || post.user;

    User.findOne({uid: uid})
      .then(function(user) {
        post.user = user._id;

        Post.create(post)
          .then(function(post) {
            if (post.parent) {
              Post.findOneAndUpdate({_id: post.parent}, {$push: {replies: post._id}}, {new: true})
                .then(function(post) {
                  console.log(`Added reply to post ${post._id}.`);
                })
            }

            User.findOneAndUpdate({uid: uid}, {$push: {posts: post._id}}, {new: true})
              .then(function(user) {
                Community.findOne({_id: post.community})
                  .then(function(community) {
                    var updated = community.feeds;

                    updated[post.feed].push(post._id);

                    Community.findOneAndUpdate({_id: post.community}, {feeds: updated}, {new: true})
                      .then(function(community) {
                        console.log(community);
                        res.json(community);
                      })
                  })
              })
          })
      })
  },
  deletePost: function(req, res) {
    const {parent, uid, _id, replies} = req.body;

    if (parent) {
      Post.updateOne({_id: parent}, {$pull: {replies: _id}})
        .then(function(result) {
          console.log('Deleted reply from parent.');
        })
    }

    if (replies) {
      replies.map(function(entry) {
        Post.deleteOne({_id: entry})
          .then(function(result) {
            console.log('Deleted reply.');
          })
      })
    }

    User.updateOne({uid: uid}, {$pull: {posts: ObjectId(_id)}})
      .then(function(result) {
        console.log('Deleted post from user.');
      })

    Post.deleteOne({_id: _id})
      .then(function(result) {
        console.log('Deleted post.');

        res.send({success: true});
      })
  },
  getPostsForUser: function(req, res) {
    Post.find({user: req.params.uid})
      .populate('user')
      .then(function(posts) {
        res.json(posts);
      })
  },
  addFriend: function(req, res) {
    User.findOne({uid: req.body.userId})
      .then(function(result) {
        const sender = req.body.sender;
        const user = result;
        const type = req.body.type;

        var sendRequest = function() {
          var sendNote = {
            type: 'friendRequest',
            uid: sender.uid,
            text: `${sender.username} has sent you a friend request.`
          };

          var sendUpdate = {
            $push: {
              notifications: sendNote,
              friends: 'pending.' + sender.uid
            }
          };

          User.updateOne({_id: user._id}, sendUpdate)
            .then(function(result) {
              console.log('addFriend sent notification', sendNote);
            })

          var pendNote = {
            type: 'friendPending',
            uid: user.uid,
            text: `Friend request sent to ${user.username}.`
          };

          var pendUpdate = {
            $push: {
              notifications: pendNote,
              friends: 'pending.' + user.uid
            }
          };

          User.findOneAndUpdate({_id: sender._id}, pendUpdate, {new: true})
            .populate('posts')
            .then(function(user) {
              console.log('addFriend pending notification', pendNote);

              res.json(user);
            })
        };

        var confirmRequest = function() {
          var confirmNote = {
            type: 'friendConfirmed',
            uid: sender.uid,
            text: `${sender.username} has confirmed your friend request.`
          };

          var newUserNotifications = [];
          var newUserFriends = user.friends;

          user.notifications.map(function(entry) {
            if (entry.uid !== sender.uid) {
              newUserNotifications.push(entry);
            }
          })

          newUserNotifications.push(confirmNote);
          newUserFriends.splice(newUserFriends.indexOf('pending.' + sender.uid), 1);
          newUserFriends.push(sender.uid);

          var confirmUpdate = {
            notifications: newUserNotifications,
            friends: newUserFriends
          };

          User.updateOne({_id: user._id}, confirmUpdate)
            .then(function(result) {
              console.log('addFriend confirm notification', confirmNote);
            })

          var addedNote = {
            type: 'friendAdded',
            uid: user.uid,
            text: `You are now friends with ${user.username}!`,
            read: true
          };

          User.findOne({_id: sender._id})
            .then(function(sender) {
              var newSenderNotifications = [];
              var newSenderFriends = sender.friends;

              sender.notifications.map(function(entry) {
                if (entry.uid !== user.uid) {
                  newSenderNotifications.push(entry);
                }
              })

              newSenderNotifications.push(addedNote);
              newSenderFriends.splice(newSenderFriends.indexOf('pending.' + user.uid), 1);
              newSenderFriends.push(user.uid);

              var addedUpdate = {
                notifications: newSenderNotifications,
                friends: newSenderFriends
              };

              User.findOneAndUpdate({_id: sender._id}, addedUpdate, {new: true})
                .populate('posts')
                .then(function(user) {
                  console.log('addFriend add notification', addedNote);

                  res.json(user);
                })
            })
        };

        var denyRequest = function() {
          var denyNote = {
            type: 'friendDenied',
            uid: sender.uid,
            text: `${sender.username} has denied your friend request.`
          };

          var newUserNotifications = [];
          var newUserFriends = user.friends;

          user.notifications.map(function(entry) {
            if (entry.uid !== sender.uid) {
              newUserNotifications.push(entry);
            }
          })

          newUserNotifications.push(denyNote);
          newUserFriends.splice(newUserFriends.indexOf('pending.' + sender.uid), 1);

          var denyUpdate = {
            notifications: newUserNotifications,
            friends: newUserFriends
          };

          User.updateOne({_id: user._id}, denyUpdate)
            .then(function(result) {
              console.log('addFriend deny notification', denyNote);
            })

          User.findOne({_id: sender._id})
            .then(function(sender) {
              var newSenderNotifications = [];
              var newSenderFriends = sender.friends;

              sender.notifications.map(function(entry) {
                if (entry.uid !== user.uid) {
                  newSenderNotifications.push(entry);
                }
              })

              newSenderFriends.splice(newSenderFriends.indexOf('pending.' + user.uid), 1);

              var denyUpdate = {
                notifications: newSenderNotifications,
                friends: newSenderFriends
              };

              User.findOneAndUpdate({_id: sender._id}, denyUpdate, {new: true})
                .populate('posts')
                .then(function(user) {
                  console.log('addFriend denied');

                  res.json(user);
                })
            })
        };

        var cancelRequest = function() {
          var newUserNotifications = [];
          var newUserFriends = user.friends;

          user.notifications.map(function(entry) {
            if (entry.uid !== sender.uid) {
              newUserNotifications.push(entry);
            }
          })

          newUserFriends.splice(newUserFriends.indexOf('pending.' + sender.uid), 1);

          var cancelUpdate = {
            notifications: newUserNotifications,
            friends: newUserFriends
          };

          User.updateOne({_id: user._id}, cancelUpdate)
            .then(function(result) {
              console.log('addFriend canceled');
            })

          User.findOne({_id: sender._id})
            .then(function(sender) {
              var newSenderNotifications = [];
              var newSenderFriends = sender.friends;

              sender.notifications.map(function(entry) {
                if (entry.uid !== user.uid) {
                  newSenderNotifications.push(entry);
                }
              })

              newSenderFriends.splice(newSenderFriends.indexOf('pending.' + user.uid), 1);

              var removeUpdate = {
                notifications: newSenderNotifications,
                friends: newSenderFriends
              };

              User.findOneAndUpdate({_id: sender._id}, removeUpdate, {new: true})
                .populate('posts')
                .then(function(user) {
                  console.log('addFriend canceled');

                  res.json(user);
                })
            })
        };

        switch (type) {
          case 'send':
            sendRequest();
            break;
          case 'confirm':
            confirmRequest();
            break;
          case 'deny':
            denyRequest();
            break;
          case 'cancel':
            cancelRequest();
            break;
        }
      })
  },
  unfriend: function(req, res) {
    const sender = req.body.sender;
    const userId = req.body.userId;

    User.updateOne({uid: userId}, {$pull: {friends: sender.uid}})
      .then(function(result) {
        console.log('removed sender from friend');
      })

    User.findOneAndUpdate({uid: sender.uid}, {$pull: {friends: userId}}, {new: true})
      .populate('posts')
      .then(function(user) {
        res.send(user);
      })
  },
  likePost: function(req, res) {
    Post.findOne({_id: req.body._id})
      .then(function(post) {
        if (post.likes.includes(req.body.uid)) {
          post.likes.splice(post.likes.indexOf(req.body.uid), 1);

          Post.updateOne({_id: post._id}, {likes: post.likes})
            .then(function() {
              res.sendStatus(201);
            })
        } else {
          Post.updateOne(post, {$push: {likes: req.body.uid}})
            .then(function() {
              res.sendStatus(201);
            })
        }
      })
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
    Post.deleteMany({})
      .then(function() {
        console.log('Posts deleted.');
      })

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