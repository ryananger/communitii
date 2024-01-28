import React, {useEffect, useState} from 'react';

import 'styles';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

const CommunityUpdate = function({update}) {
  const [text, setText] = useState(null);
  const [expand, setExpand] = useState(false);

  var handleUpdate = function() {
    switch (update.type) {
      case 'joinRequest':
        var str = `${update.username} has asked to join ${st.community.name}.`;

        setText(str);
        break;
      case 'text':
        setText(update.text);
        break;
    }
  };

  var handleClick = function(type) {
    ax.handleJoinRequest(type, update.uid, update.username);
  };

  var renderButtons = function() {
    return (
      <div className='updateInfoButtons h'>
        <div className='updateInfoButton yes v' onClick={()=>{handleClick('yes')}}>
          approve
        </div>
        <div className='updateInfoButton no v' onClick={()=>{handleClick('no')}}>
          deny
        </div>
      </div>
    )
  };

  useEffect(handleUpdate, []);

  return (
    <div className='updateContainer v'>
      <div className={`${expand ? 'activeUpdate' : 'updateInfo'} v`} onClick={()=>{setExpand(!expand)}}>
        {text}
      </div>
      {update.type !== 'text' && expand && renderButtons()}
    </div>
  );
};

export default CommunityUpdate;

