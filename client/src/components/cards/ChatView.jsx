import React, {lazy, useEffect, useState} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

import ChatViewEntry from './ChatViewEntry.jsx';

const ChatView = function() {
  var messages = helpers.sortMessages(st.user.messages);

  var renderChats = function() {
    var rendered = [];

    messages.map(function(message, i) {
      rendered.push(<ChatViewEntry key={'chatViewEntry_' + i} entry={message}/>);
    })

    return rendered;
  };

  return (
    <div className='chatBox v'>
      {renderChats()}
    </div>
  );
};

export default ChatView;

