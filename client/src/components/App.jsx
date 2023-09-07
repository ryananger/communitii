import React, {useEffect, useState} from 'react';

import 'styles';
import st from 'ryscott-st';
import pusher from './pusher.js';
import {ax, helpers} from 'util';

import Nav from './Nav.jsx';
import Home from './feeds/Home.jsx';
import Login from './Login.jsx';
import Alert from './Alert.jsx';
import Find from './find/Find.jsx';
import CommunityUpdates from './CommunityUpdates.jsx';

const cookie = helpers.cookieParse();

const App = function() {
  const [view, setView] = st.newState('view', useState('find'));
  const [user, setUser] = st.newState('user', useState(null));
  const [community, setCommunity] = st.newState('community', useState(null));

  const [isAdmin, setIsAdmin] = useState(false);

  const views = {
    home:  <Home/>,
    login: <Login/>,
    find:  <Find/>
  };

  var userFromCookie = function() {
    if (!user && cookie.user) {
      ax.getUser(cookie.user);
    }
  };

  var handleUser = function() {
    if (user && user.community) {
      ax.getCommunity(user.community);
    } else {
      setView('find');
      setIsAdmin(false);
      setCommunity(null);
    }
  };

  var handleCommunity = function() {
    if (!community) {return};

    community.members.map(function(member) {
      if (member.uid === user.uid) {
        setIsAdmin(member.admin);
      }
    });

    handlePusher();
  };

  var handlePusher = function() {
    const channel = pusher.subscribe(`${community._id}`);

    channel.bind('adminUpdate', function(data) {
      var updated = community.notifications;

      updated.push(data);

      helpers.alert('New community notification.');

      setCommunity({...community, notifications: updated});
    });

    channel.bind('userUpdate', function(data) {
      console.log(data);
    })
  };

  useEffect(userFromCookie, []);
  useEffect(handleUser, [user]);
  useEffect(handleCommunity, [community]);

  return (
    <div className='app v'>
      <Alert />
      <Nav user={user}/>
      <div className='main h'>
        <div className='social v'>
          <div className='friends v'>

          </div>
          <div className='chat v'>

          </div>
        </div>
        <div className='feed v'>
          {views[view] || view}
        </div>
        <div className='wing v'>
          {isAdmin && <CommunityUpdates community={community}/>}
        </div>
      </div>
    </div>
  );
};

export default App;

