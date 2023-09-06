import React, {useEffect, useState} from 'react';

import 'styles';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

import Nav from './Nav.jsx';
import Home from './feeds/Home.jsx';
import Login from './Login.jsx';
import Alert from './Alert.jsx';
import Find from './Find.jsx';

const cookie = helpers.cookieParse();

const App = function() {
  const [view, setView] = st.newState('view', useState('find'));
  const [user, setUser] = st.newState('user', useState(null));
  const [community, setCommunity] = st.newState('community', useState(null));

  const views = {
    home: <Home/>,
    login: <Login/>,
    find: <Find/>
  };

  var userFromCookie = function() {
    if (!user && cookie.user) {
      ax.getUser(cookie.user);
    }
  };

  var handleUser = function() {
    if (user && user.community) {
      setView('home');
      ax.getCommunity(user.community);
    } else {
      setView('find');
    }
  };

  useEffect(userFromCookie, []);
  useEffect(handleUser, [user]);

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
          <div className='updates v'>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

