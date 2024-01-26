import React, {useEffect, useState} from 'react';

import 'styles';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

import CommunityUpdate from './CommunityUpdate.jsx';

const CommunityUpdates = function({community}) {
  const [updates, setUpdates] = useState(community.notifications);

  var renderUpdates = function() {
    var rendered = [];

    updates.map(function(update, i) {
      rendered.unshift(<CommunityUpdate key={'update_' + i} update={update}/>);
    })

    return rendered;
  };

  useEffect(()=>{
    setUpdates(community.notifications);
  }, [community]);

  return (
    <div className='updates v'>
      {renderUpdates()}
    </div>
  );
};

export default CommunityUpdates;

