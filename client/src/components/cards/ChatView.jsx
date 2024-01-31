import React, {lazy, useEffect, useState} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

import ChatViewEntry from './ChatViewEntry.jsx';

const ChatView = function() {
  const messages = st.user.messages;

  var renderChats = function() {
    var rendered = [];

    for (var uid in messages) {
      rendered.push(<ChatViewEntry key={uid} entry={messages[uid]}/>);
    }

    return rendered;
  };

  return (
    <div className='chatBox v'>
      {renderChats()}
    </div>
  );
};

export default ChatView;

