import React, {lazy, useEffect, useState} from 'react';

import st from 'ryscott-st';
import {helpers} from 'util';

const updates = [
  { user: "Gertrude", update: "I'm so glad someone from the neighborhood shoveled my walk today!" },
  { user: "Mo", update: "President is announcing aliens live." },
  { user: "Mo", update: "The aliens said God is real." },
  { user: "Steve", update: "FAKE NEWS" },
  { user: "Mo", update: "I guess they need help building their temple, who's coming with?" },
  { user: "John", update: "An alien brought me pancakes today?" },
  { user: "Alice", update: "What's with all the pancakes?" },
  { user: "Mohammad", update: "They seem to enjoy sugar."},
  { user: "Betty", update: "I wonder if they like borscht."}
];

const Global = function({user}) {
  var renderMessages = function() {
    var rendered = [];

    updates.map(function(update, i) {
      rendered.push(
        <div key={update.user + '_' + i} className='globalEntry v'>
          <b>{update.user}</b>
          <div style={{marginLeft: '4px'}}>{update.update}</div>
        </div>
      );
    })

    return rendered;
  };

  return (
    <div className='globalMessages v'>
      {renderMessages()}
    </div>
  );
};

export default Global;

