import React, {useEffect, useState} from 'react';

import st            from 'ryscott-st';
import {ax} from 'util'

import CommunityCard from './CommunityCard.jsx';

const CommunityList = function({found}) {
  const [requested, setRequested] = useState(null);

  var renderList = function() {
    var rendered = [];

    found.map(function(community, i) {
      rendered.push(<CommunityCard key={i} community={community} requested={requested === community._id ? 1 : 0}/>);
    });

    return rendered;
  };

  useEffect(()=>{
    if (st.user.notifications) {
      st.user.notifications.map(function(entry, i) {
        if (entry.type === 'joinRequest') {
          setRequested(entry.community);
        }
      })
    }
  }, []);

  return (
    <div className='communityList v'>
      {renderList()}
    </div>
  )
};

export default CommunityList;

