import React, {lazy, useEffect, useState} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

const ChatViewEntry = function({entry}) {
  var style = entry.unread > 0 ? {fontWeight: 'bold'} : {};
  var msgs = entry.messages;

  var handleClick = function() {
    st.setChatWith(entry.info);

    if (st.view === 'chat') {
      st.setView('chat');
    }
  };

  return (
    <div className='chatViewEntry h' style={style} onClick={()=>{st.setChatWith(entry.info)}}>
      {entry.info.username}: {msgs[msgs.length - 1].text}
    </div>
  );
};

export default ChatViewEntry;

