import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';
import {ax} from 'util';

const CommunityCard = function({community, requested}) {
  const [text, setText] = useState(requested ? 'pending' :'join');

  var joinRequest = function() {
    if (requested) {return};

    setText('pending');
    ax.joinRequest(community._id, community.name);
  };

  return (
    <div className='communityCard card h'>
      <img className='communityImg' src='https://earthpunk.art/public/images/jupiterFalls.png'/>
      <div className='communityInfo v'>
        <h4>{community.name}</h4>
        <small>
          {community.members.length === 1 ? '1 member' : community.members.length + ' members'}
        </small>
      </div>
      {st.user && <div className='joinButton v c' onClick={joinRequest}>{text}</div>}
    </div>
  )
};

export default CommunityCard;

