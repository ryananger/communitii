import React, {lazy, useEffect, useState} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

const ChatViewEntry = function({entry, community}) {
  var style = entry && entry.unread ? {fontWeight: 'bold'} : {};
  var msgs = entry && entry.messages || st.community.messages;

  if (community) {
    return (
      <div className='chatViewEntry h' style={style} onClick={()=>{st.setChatWith('community')}}>
        {st.community.name}: {msgs.length > 0 && msgs[msgs.length - 1].text || ''}
      </div>
    )
  }

  return (
    <div className='chatViewEntry h' style={style} onClick={()=>{st.setChatWith(entry.info)}}>
      {entry.info.username}: {msgs.length > 0 && msgs[msgs.length - 1].text || ''}
    </div>
  );
};

export default ChatViewEntry;

