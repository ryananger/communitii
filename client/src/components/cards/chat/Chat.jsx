import React, {lazy, useEffect, useState} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

import ChatWith from './ChatWith.jsx';
import ChatView from './ChatView.jsx';

const Chat = function() {
  const chatWith = st.chatWith;
  const expanded = st.view === 'chat';

  return (
    <div className='chatContainer v'>
      {!chatWith && st.user && <ChatView />}
      {expanded && <ChatView />}
      {chatWith && !expanded && <ChatWith />}
    </div>
  )
};

export default Chat;

