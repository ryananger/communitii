import React, {useEffect, useState} from 'react';

import st            from 'ryscott-st';
import {ax, helpers} from 'util';

import CreateForm from './CreateForm.jsx';

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

  var handleFind = function() {
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
          <input id='findInput' placeholder='find a community'/>
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

const CommunityList = function({found}) {
  var rendered = [];

  found.map(function(community, i) {
    rendered.push(
      <div key={i} className='communityInfo h'>
        {community.name}
        {community.members.length}
      </div>
    )
  });

  return rendered;
};

export default Find;

