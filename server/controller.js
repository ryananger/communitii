const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
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
        Post.find({user: user._id})
          .populate('user')
          .populate('replies')
          .populate({path: 'replies', populate: {path: 'user'}})
          .then(function(posts) {
            user.posts = posts;

            res.json(user);
          })
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
              .populate('posts')
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

        var getPosts = async function(feed, resolve) {
          var posts = await Post.find({community: community._id, feed: feed}).populate('user');

          newFeeds[feed] = posts;
          resolve();
        };

        for (var key in community.feeds) {
          newFeeds[key] = [];

          var promise = new Promise(function(resolve) {
            getPosts(key, resolve);
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
      .populate('posts')
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
                  pusher.trigger(`${uid}`, 'userUpdate', {update: userNotify});
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
                  pusher.trigger(`${uid}`, 'userUpdate', {update: userNotify});
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
            console.log('Created post.');

            if (post.parent) {
              Post.findOneAndUpdate({_id: post.parent}, {$push: {replies: ObjectId(post._id)}}, {new: true})
                .then(function(post) {
                  console.log(`Added reply to post ${post._id}.`);
                })
            }

            User.findOneAndUpdate({uid: uid}, {$push: {posts: ObjectId(post._id)}}, {new: true})
              .then(function(user) {
                pusher.trigger(`${user.community}`, 'communityUpdate', {text: 'New post.'});
                res.send({success: true});
              })
          })
      })
  },
  deletePost: function(req, res) {
    const {parent, uid, _id, replies} = req.body;

    if (parent) {
      Post.updateOne({_id: parent}, {$pull: {replies: ObjectId(_id)}})
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

    User.findOneAndUpdate({uid: uid}, {$pull: {posts: ObjectId(_id)}})
      .then(function(user) {
        pusher.trigger(`${user.community}`, 'communityUpdate', {text: 'Deleted post.'});
        console.log('Deleted post from user.');
      })

    Post.deleteOne({_id: _id})
      .then(function(result) {
        console.log('Deleted post.');
        res.send({success: true});
      })
  },
  getPost: function(req, res) {
    Post.findOne({_id: req.params._id})
      .populate('user')
      .populate('replies')
      .populate({path: 'replies', populate: {path: 'user'}})
      .then(function(post) {
        res.json(post);
      })
  },
  addFriend: async function(req, res) {
    const sender = await User.findOne({uid: req.body.senderId});

    User.findOne({uid: req.body.friendId})
      .then(function(result) {
        const user = result;
        const type = req.body.type;

        const friendInfo = {
          _id: user._id.toString(),
          uid: user.uid,
          username: user.username,
          settings: user.settings,
          status: 'online'
        };

        const senderInfo = {
          _id: sender._id.toString(),
          uid: sender.uid,
          username: sender.username,
          settings: sender.settings,
          status: 'online'
        };

        var sendRequest = function() {
          var sendNote = {
            type: 'friendRequest',
            uid: sender.uid,
            text: `${sender.username} has sent you a friend request.`
          };

          var sendUpdate = {
            $push: {
              notifications: sendNote,
              friends: {...senderInfo, uid: 'pending.' + sender.uid}
            }
          };

          User.updateOne({_id: user._id}, sendUpdate)
            .then(function(result) {
              pusher.trigger(user.uid, 'userUpdate', {update: {text: `${sender.username} sent a friend request!`}});
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
              friends: {...friendInfo, uid: 'pending.' + user.uid}
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

          newUserFriends.map(function(friend) {
            if (friend._id.toString() === sender._id.toString()) {
              friend.uid = friend.uid.slice(8);
            }
          })

          var confirmUpdate = {
            notifications: newUserNotifications,
            friends: newUserFriends
          };

          User.updateOne({_id: user._id}, confirmUpdate)
            .then(function(result) {
              pusher.trigger(user.uid, 'userUpdate', {update: {text: confirmNote.text}});
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

              newSenderFriends.map(function(friend) {
                if (friend._id.toString() === user._id.toString()) {
                  friend.uid = friend.uid.slice(8);
                }
              })

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
          var newUserFriends = [];

          user.notifications.map(function(entry) {
            if (entry.uid !== sender.uid) {
              newUserNotifications.push(entry);
            }
          })

          newUserNotifications.push(denyNote);

          user.friends.map(function(friend) {
            if (friend._id !== senderInfo._id) {
              newUserFriends.push(friend);
            }
          })

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
              var newSenderFriends = [];

              sender.notifications.map(function(entry) {
                if (entry.uid !== user.uid) {
                  newSenderNotifications.push(entry);
                }
              })

              sender.friends.map(function(friend) {
                if (friend._id !== friendInfo._id) {
                  newSenderFriends.push(friend);
                }
              })

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
          var newUserFriends = [];

          user.notifications.map(function(entry) {
            if (entry.uid !== sender.uid) {
              newUserNotifications.push(entry);
            }
          })

          user.friends.map(function(friend) {
            if (friend._id !== senderInfo._id) {
              newUserFriends.push(friend);
            }
          })

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
              var newSenderFriends = [];

              sender.notifications.map(function(entry) {
                if (entry.uid !== user.uid) {
                  newSenderNotifications.push(entry);
                }
              })

              sender.friends.map(function(friend) {
                if (friend._id !== friendInfo._id) {
                  newSenderFriends.push(friend);
                }
              })

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

    User.findOne({uid: userId})
      .then(function(user) {
        var newFriends = [];

        user.friends.map(function(friend) {
          if (friend.uid !== sender) {
            newFriends.push(friend);
          }
        })

        User.updateOne({uid: userId}, {friends: newFriends})
          .then(function(result) {
            console.log('removed sender from friend');
          })
      })

    User.findOne({uid: sender})
      .then(function(user) {
        var newFriends = [];

        user.friends.map(function(friend) {
          if (friend.uid !== userId) {
            newFriends.push(friend);
          }
        })

        User.findOneAndUpdate({uid: user.uid}, {friends: newFriends}, {new: true})
          .populate('posts')
          .then(function(user) {
            console.log('removed friend from sender');

            res.send(user);
          })
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

        User.findOneAndUpdate({uid: user.uid}, {notifications: user.notifications})
          .then(function(updated) {
            res.json(user.notifications);
          })
      })
  },
  sendMessage: async function(req, res) {
    const message = req.body;

    const sentTo = await User.findOne({uid: message.sentTo});
    const sentBy = await User.findOne({uid: message.sentBy});

    var handleMessages = function(messages, user) {
      var info = {
        _id: user._id,
        uid: user.uid,
        username: user.username,
        settings: user.settings
      };

      var msgs = messages[user.uid];

      message.username = user.username;

      if (!msgs) {
        msgs = {messages: [], unread: 0};
      }

      messages[user.uid] = msgs = {
        messages: [...msgs.messages, message],
        unread: Number(msgs.unread) + 1,
        info: info
      };

      return messages;
    };

    var m1 = handleMessages(sentTo.messages, sentBy);
    var m2 = handleMessages(sentBy.messages, sentTo);

    m2[sentTo.uid].unread = 0;

    User.updateOne({uid: sentTo.uid}, {messages: m1})
      .then(function(result) {
        pusher.trigger(sentTo.uid, 'userUpdate', {update: 'messages'});
      })

    User.findOneAndUpdate({uid: sentBy.uid}, {messages: m2}, {new: true})
      .then(function(user) {
        res.json(user.messages);
      })
  },
  readMessages: function(req, res) {
    User.findOne({uid: req.body.uid})
      .then(function(user) {
        user.messages[req.body.chatUid].unread = 0;

        User.findOneAndUpdate({uid: user.uid}, {messages: user.messages})
          .then(function(updated) {
            res.json(user.messages);
          })
      })
  },

  fix: async function(req, res) {
    // Post.deleteMany({})
    //   .then(function() {
    //     console.log('Posts deleted.');
    //   })

    // Community.deleteMany({})
    //   .then(function(response) {
    //     console.log(response);
    //   })

    var users = await User.find();

    users.map(async function(user, i) {
      var roles = ['Baker', 'Artist', 'Plumber'];

      var newSettings = {...user.settings, roles: [roles[i]]};

      await User.updateOne({uid: user.uid}, {settings: newSettings})
        .then(function(result) {
          console.log(newSettings);
        })
    })

    res.send('yay');
  }
};

module.exports = controller;