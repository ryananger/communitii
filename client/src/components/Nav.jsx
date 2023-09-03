import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';

const Nav = function() {
  return (
    <div className='nav h'>
      <div className='title h'>
        <h3 class='navButton' onClick={()=>{st.setView('home')}}>communitii</h3>
      </div>
      <div className='h' style={{width: '320px'}}>
        <h4 class='navButton' onClick={()=>{st.setView('learn')}}>learn</h4>
        <h4 class='navButton' onClick={()=>{st.setView('grow')}}>grow</h4>
        <h4 class='navButton' onClick={()=>{st.setView('work')}}>work</h4>
        <h4 class='navButton' onClick={()=>{st.setView('play')}}>play</h4>
        <h4 class='navButton' onClick={()=>{st.setView('help')}}>help</h4>
      </div>
    </div>
  );
};

export default Nav;

