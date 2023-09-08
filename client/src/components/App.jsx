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
import Admin from './admin/Admin.jsx';
import CommunityUpdates from './admin/CommunityUpdates.jsx';
import CommunityHead from './admin/CommunityHead.jsx';

const cookie = helpers.cookieParse();

const App = function() {
  const [view, setView] = st.newState('view', useState('find'));
  const [user, setUser] = st.newState('user', useState(null));
  const [community, setCommunity] = st.newState('community', useState(null));

  const [isAdmin, setIsAdmin] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

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
    if (!community || loaded) {return};

    community.members.map(function(member) {
      if (member.uid === user.uid) {
        setIsAdmin(member.admin);
        handlePusher(member.admin);
        setLoaded(true);
      }
    });
  };

  var handlePusher = function(admin) {
    const communityChannel = pusher.subscribe(`${community._id}`);
    const userChannel = pusher.subscribe(`${user.uid}`);

    if (admin) {
      communityChannel.bind('adminUpdate', function(data) {
        helpers.alert('New community notification.');
        setCommunity({...community, notifications: data});
      });
    }

    userChannel.bind('userUpdate', function(data) {
      if (data.uid === user.uid) {
        setUser(data);
      }
    });

    communityChannel.bind('communityUpdate', function(data) {
      console.log(data);
    });
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
          {community && <CommunityHead community={community} open={setAdminOpen}/>}
          {isAdmin && <CommunityUpdates community={community}/>}
        </div>
      </div>
      {isAdmin && <Admin open={adminOpen} setOpen={setAdminOpen}/>}
    </div>
  );
};

export default App;

