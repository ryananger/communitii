import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';

import {helpers} from 'util';

const Nav = function({user}) {
  var handleLogin = function() {
    if (user) {
      helpers.logOut();
    } else {
      st.setView('login');
    }
  };

  return (
    <div className='nav h'>
      <div className='title h'>
        <h3 className='navButton' onClick={()=>{st.setView(user && user.community ? 'home' : 'find')}}>communitii</h3>
      </div>
      <div className='h' style={{width: '320px'}}>
        <h4 className='navButton grow' onClick={()=>{st.setView('learn')}}>learn</h4>
        <h4 className='navButton grow' onClick={()=>{st.setView('grow')}}>grow</h4>
        <h4 className='navButton grow' onClick={()=>{st.setView('work')}}>work</h4>
        <h4 className='navButton grow' onClick={()=>{st.setView('play')}}>play</h4>
        <h4 className='navButton grow' onClick={()=>{st.setView('help')}}>help</h4>
      </div>
      <div className='util h'>
        <div className='loginButton grow' onClick={handleLogin}>{user ? 'logout' : 'login'}</div>
      </div>
    </div>
  );
};

export default Nav;

