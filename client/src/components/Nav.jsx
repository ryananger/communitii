import React, {lazy, useEffect, useState} from 'react';

import st from 'ryscott-st';
import {helpers} from 'util';

import Util from './Util.jsx';

const Nav = function({user}) {
  var handleClick = function(view) {
    if (user && user.community) {
      st.setView(view);
    }
  };

  return (
    <div className='nav h'>
      <div className='title h'>
        <h3 className='homeButton' onClick={()=>{st.setView(user && user.community ? 'home' : 'find')}}>communitii</h3>
      </div>
      <div className='h' style={{width: '400px'}}>
        <h4 className={`navButton grow ${st.view === 'learn' ? 'navSelect' : ''}`} onClick={()=>{handleClick('learn')}}>learn</h4>
        <h4 className={`navButton grow ${st.view === 'grow' ? 'navSelect' : ''}`} onClick={()=>{handleClick('grow')}}>grow</h4>
        <h4 className={`navButton grow ${st.view === 'work' ? 'navSelect' : ''}`} onClick={()=>{handleClick('work')}}>work</h4>
        <h4 className={`navButton grow ${st.view === 'play' ? 'navSelect' : ''}`} onClick={()=>{handleClick('play')}}>play</h4>
        <h4 className={`navButton grow ${st.view === 'help' ? 'navSelect' : ''}`} onClick={()=>{handleClick('help')}}>help</h4>
      </div>
      <Util user={user}/>
    </div>
  );
};

export default Nav;

