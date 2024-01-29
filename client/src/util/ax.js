import axios from 'axios';
import st    from 'ryscott-st';
import {helpers} from 'util';

var urlBase = process.env.URL;

var ax = {
  createUser: function(user) {
    axios.post(process.env.URL + 'api/users', user)
      .then(function(response) {
        document.cookie = `user=${user.uid}`;

        st.setUser(response.data);

        helpers.alert('Welcome to communitii!');
      })
  },
  getUser: function(uid, mount) {
    axios.get(process.env.URL + 'api/users/' + uid)
      .then(function(response) {
        var user = response.data;

        st.setUser(user);

        if (mount) {
          document.cookie = `user=${uid}`;
        }
      })
  },
  getProfile: function(uid) {
    axios.get(process.env.URL + 'api/users/profile/' + uid)
      .then(function(response) {
        var user = response.data;

        st.setProfile(user);
      })
  },
  createCommunity: function(sendBody) {
    axios.post(process.env.URL + 'api/communities', sendBody)
      .then(function(response) {
        var user = response.data;

        st.setUser(user);
        helpers.alert('Community created!');
      })
  },
  getCommunity: function(id) {
    axios.get(process.env.URL + 'api/communities/' + id)
      .then(function(response) {
        var community = response.data;

        community = ax.transformFeeds(community);

        st.setCommunity(community);

        if (st.view === 'find' || st.view === 'login') {
          st.setView('home');
        }
      })
  },
  transformFeeds: function(community) {
    for (var key in community.feeds) {
      var feed = community.feeds[key];

      feed = helpers.transformFeed(feed);
    }

    return community;
  },
  findCommunities: function(input, setFound) {
    axios.get(process.env.URL + 'api/communities/find/' + input)
      .then(function(response) {
        setFound(response.data);
      })
  },
  joinRequest: function(id, name) {
    var sendBody = {
      user: st.user.uid,
      username: st.user.username,
      community: id,
      name: name
    };

    axios.post(process.env.URL + 'api/communities/join/', sendBody)
      .then(function(response) {
        st.setUser(response.data);
        helpers.alert('Request sent!');
      })
  },
  handleJoinRequest: function(type, uid, username) {
    var sendBody = {
      type,
      uid,
      username,
      comm: st.community._id,
      name: st.community.name
    };

    axios.post(process.env.URL + 'api/communities/join/handle', sendBody)
      .then(function(response) {
        var community = response.data;

        community = ax.transformFeeds(community);

        st.setCommunity(community);
      })
  },
  updateSettings: function(send) {
    axios.post(process.env.URL + 'api/users/settings', send)
      .then(function(response) {
        st.setUser({...st.user, settings: response.data});
      })
  },
  submitPost: function(post) {
    axios.post(process.env.URL + 'api/posts/submit', post)
      .then(function(response) {
        if (response.data.success) {
          ax.getCommunity(st.user.community);
          ax.getUser(st.user.uid);

          if (st.view === 'profile') {
            ax.getProfile(st.profile.uid);
          }
        }
      })
  },
  sendMessage: function(message) {
    axios.post(process.env.URL + 'api/messages/send', message)
      .then(function(response) {
        st.setUser({...st.user, messages: response.data});
      })
  },
  deletePost: function(send) {
    axios.post(process.env.URL + 'api/posts/delete', send)
      .then(function(response) {
        if (response.data.success) {
          ax.getCommunity(st.user.community);
          ax.getUser(st.user.uid);

          if (st.view === 'profile') {
            ax.getProfile(st.profile.uid);
          }
        }
      })
  },
  addFriend: function(sender, uid, type) {
    axios.post(process.env.URL + 'api/addFriend', {sender: sender, userId: uid, type})
      .then(function(response) {
        st.setUser(response.data);
      })
  },
  unfriend: function(sender, uid) {
    axios.post(process.env.URL + 'api/unfriend', {sender: sender, userId: uid})
      .then(function(response) {
        st.setUser(response.data);
      })
  },
  likePost: function(post) {
    var sendBody = {
      _id: post._id,
      uid: st.user.uid
    };

    axios.put(process.env.URL + 'api/posts/likePost', sendBody)
      .then(function(response) {

      })
  },
  readNotifications: function() {
    axios.post(process.env.URL + 'api/readNotifications', {uid: st.user.uid})
      .then(function(response) {
        st.setUser({...st.user, notifications: response.data});
      })
  }
};

export default ax;
