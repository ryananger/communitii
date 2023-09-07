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

        console.log('Retrieved user from database.', user);
      })
  },
  createCommunity: function(sendBody) {
    axios.post(process.env.URL + 'api/communities', sendBody)
      .then(function(response) {
        var community = response.data;

        st.setUser({...st.user, community: response.data._id});
        st.setView('home');
      })
  },
  getCommunity: function(id) {
    axios.get(process.env.URL + 'api/communities/' + id)
      .then(function(response) {
        st.setCommunity(response.data);
      })
  },
  findCommunities: function(input, setFound) {
    axios.get(process.env.URL + 'api/communities/find/' + input)
      .then(function(response) {
        setFound(response.data);
      })
  },
  joinRequest: function(uid, id, name) {
    axios.post(process.env.URL + 'api/communities/join/', {user: uid, community: id, name: name})
      .then(function(response) {
        st.setUser(response.data);
      })
  }
};

export default ax;
