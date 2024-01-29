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
      <div style={{height: '4px', width: '100%', position: 'absolute', bottom: '0', backgroundColor: `var(--${st.color})`}}/>
      <div className='title h'>
        <h3 className='homeButton' onClick={()=>{st.setView(user && user.community ? 'home' : 'find')}}>communitii</h3>
      </div>
      <div className='navButtons h'>
        <h4 className={`navButton v grow`} style={{backgroundColor: st.view === 'learn' ? 'var(--learn)' : 'unset'}} onClick={()=>{handleClick('learn')}}>learn</h4>
        <h4 className={`navButton v grow`} style={{backgroundColor: st.view === 'grow' ? 'var(--grow)' : 'unset'}} onClick={()=>{handleClick('grow')}}>grow</h4>
        <h4 className={`navButton v grow`} style={{backgroundColor: st.view === 'work' ? 'var(--work)' : 'unset'}} onClick={()=>{handleClick('work')}}>work</h4>
        <h4 className={`navButton v grow`} style={{backgroundColor: st.view === 'play' ? 'var(--play)' : 'unset'}} onClick={()=>{handleClick('play')}}>play</h4>
        <h4 className={`navButton v grow`} style={{backgroundColor: st.view === 'help' ? 'var(--help)' : 'unset'}} onClick={()=>{handleClick('help')}}>help</h4>
      </div>
      <Util user={user}/>
    </div>
  );
};

export default Nav;

