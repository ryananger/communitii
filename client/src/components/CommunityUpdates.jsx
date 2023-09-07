import React, {useEffect, useState} from 'react';

import 'styles';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

const CommunityUpdates = function({community}) {
  const updates = community.notifications;

  var renderUpdates = function() {
    var rendered = [];

    updates.map(function(update) {
      var str = '';

      switch (update.type) {
        case 'joinRequest':
          str = `${update.username} has asked to join ${community.name}.`;
          break;
      }

      rendered.push(<div className='updateInfo'>{str}</div>)
    })

    return rendered;
  };

  return (
    <div className='updates v'>
      {renderUpdates()}
    </div>
  );
};

export default CommunityUpdates;

