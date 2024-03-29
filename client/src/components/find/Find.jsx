import React, {useEffect, useState} from 'react';

import st            from 'ryscott-st';
import {ax, helpers} from 'util';

import CreateForm from './CreateForm.jsx';
import CommunityList from './CommunityList.jsx';

const Find = function() {
  const [mode, setMode] = useState(null);
  const [found, setFound] = useState([]);

  var renderMode = function() {
    if (mode === 'find') {
      return <CommunityList found={found}/>;
    } else if (mode === 'create') {
      return <CreateForm/>;
    }
  };

  var handleClick = function() {
    if (!st.user) {
      helpers.alert('You must be logged in to do that!');
      return;
    }

    if (mode !== 'create') {
      setMode('create');
    } else {
      setMode(null);
    }
  };

  var handleFind = function(e) {
    if (e.key){
      if (e.key !== 'Enter') {
        return;
      }
    }

    var input = document.getElementById('findInput').value;

    if (!input) {return};

    ax.findCommunities(input, setFound);
    setMode('find');
  };

  useEffect(()=>{
    if (!st.user) {
      setMode(null);
    }
  }, [st.user]);

  return (
    <div className='findCommunity v'>
      <div className='communityButtons v'>
        <div className='communityInput h'>
          <input id='findInput' placeholder='find a community' onKeyUp={handleFind}/>
          <div className='go v c' onClick={handleFind}>GO</div>
        </div>
        <div className='communityButton v c' onClick={()=>{handleClick()}}>
          create a community
        </div>
      </div>
      {renderMode()}
    </div>
  )
};

export default Find;

