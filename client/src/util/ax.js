import axios from 'axios';
import st    from 'ryscott-st';
import {helpers} from 'util';

var urlBase = process.env.URL;

var ax = {
  createUser: function(user) {
    axios.post(urlBase + 'api/users', user)
      .then(function(response) {
        document.cookie = `user=${user.uid}`;

        st.setUser(response.data);

        helpers.alert('Welcome to communitii!');
        console.log('Created user in database.', response.data);
      })
  },
  getUser: function(uid) {
    axios.get(urlBase + 'api/users/' + uid)
      .then(function(response) {
        var user = response.data;

        st.setUser(user);
        document.cookie = `user=${uid}`;

        console.log('Retrieved user from database.', user);
      })
  }
};

var peopleGen = function() {
  var lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Davis',
    'Rodriquez',
    'Martinez',
    'Hernandez',
    'Moore',
    'Jackson',
    'Lee'
  ]; //13

  var firstNames = [
    'Sophia',
    'Liam',
    'Olivia',
    'Noah',
    'Riley',
    'Jackson',
    'Emma',
    'Aiden',
    'Ava',
    'Elijah',
    'Isabella',
    'Grayson',
    'Arya',
    'Peter',
    'Janine',
    'John',
    'Rebecca',
    'Steven',
    'Jennifer',
    'Michael',
    'Rachel'
  ]; //21

  var gen = function(i) {
    var uid   = 'fakeUser_' + (i + 4000).toString().padStart(6, '0');
    var first = firstNames[helpers.rand(21)];
    var last  = lastNames[helpers.rand(13)];
    var phone = helpers.rand(9000000000) + 1000000000;
    var email = `${last.toLowerCase()}.${first.toLowerCase()}.${helpers.rand(100)}@gmail.com`;
    var zip   = helpers.rand(90000) + 10000;
    var age   = helpers.rand(60) + 18;
    var size  = helpers.rand(5) + 1;

    var user = {
      uid,
      firstName: first,
      lastName: last,
      email,
      phone,
      zip,
      age,
      familySize: size,
      pantries: ['test@test.com']
    };

    if (i > 900) {return};

    axios.post(urlBase + 'api/customers/', user)
      .then(function(response) {
        axios.post(urlBase + 'api/pantries/customer/' + user.uid, {email: 'test@test.com'})
          .then(function(response) {
            gen(i + 1);
            console.log(user);
            helpers.alert('Information saved!');
          })
      })
  };

  gen(0);
};

ax.peopleGen = peopleGen;

export default ax;
