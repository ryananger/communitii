import React, {lazy, useEffect, useState} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

import ChatWith from './ChatWith.jsx';
import ChatView from './ChatView.jsx';

const Chat = function() {
  const [chatWith, setChatWith] = st.newState('chatWith', useState(null));

  if (!chatWith && st.user) {return <ChatView />};

  if (chatWith) {return <ChatWith />};
};

export default Chat;

