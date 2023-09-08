import React, {useEffect, useState} from 'react';

import 'styles';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

import CommunityUpdate from './CommunityUpdate.jsx';

const CommunityUpdates = function({community}) {
  const updates = community.notifications;

  var renderUpdates = function() {
    var rendered = [];

    updates.map(function(update) {
      rendered.push(<CommunityUpdate update={update}/>);
    })

    return rendered;
  };

  useEffect(()=>{

  }, [community]);

  return (
    <div className='updates v'>
      {renderUpdates()}
    </div>
  );
};

export default CommunityUpdates;

