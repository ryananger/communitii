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
        console.log('Created user in database.', response.data);
      })
  },
  getUser: function(uid) {
    axios.get(process.env.URL + 'api/users/' + uid)
      .then(function(response) {
        var user = response.data;

        st.setUser(user);
        document.cookie = `user=${uid}`;
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
        st.setCommunity(response.data);
        st.setView('home');
      })
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
        st.setCommunity(response.data);
        console.log(response.data);
      })
  }
};

export default ax;
