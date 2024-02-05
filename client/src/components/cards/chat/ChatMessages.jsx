import React, {lazy, useEffect, useState} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

const ChatMessages = function() {
  const [messages, setMessages] = st.newState('messages', useState([]));
  const chatWith = st.chatWith;

  var renderMessages = function() {
    var rendered = [];
    var current = null;
    var lastDate = null;

    messages.map(function(message, i) {
      if (!message.text) {return};

      var userSent = message.user._id === st.user._id;
      var tag = userSent ? 'userSent' : 'friendSent';
      var addHead = current === message.user.uid ? false : true;
      var thisDate = new Date(message.createdOn);
      var dateText = helpers.getDate(thisDate);
      var dateEl = <small className='dateEl'>{dateText}</small>;
      var style = i === 0 ? {borderTop: 'none', marginTop: '0'}: {};

      if (!addHead && lastDate !== thisDate.getDate()) {
        addHead = true;
      }

      rendered.push(
        <div key={message.user.uid + i} className='messageEntry v'>
          {addHead &&
            <div className={`messageHead ${tag} h`} style={style} onClick={()=>{!userSent && ax.getProfile(message.user.uid)}}>
              {tag === 'userSent' && dateEl}
              {message.user.username}
              {tag === 'friendSent' && dateEl}
            </div>
          }
          <div className={`messageText ${tag} h`}>{message.text}</div>
        </div>
      );

      current = message.user.uid;
      lastDate = new Date(message.createdOn).getDate();
    })

    return rendered;
  };

  var handleMessages = function() {
    if (chatWith === 'community') {
      setMessages(st.community.messages);
      return;
    }

    var userMessages;

    if (st.user.messages && st.user.messages[chatWith._id]) {
      userMessages = st.user.messages[chatWith._id].messages;

      if (st.user.messages[chatWith._id].unread > 0) {
        ax.readMessages(chatWith._id);
      }
    } else {
      userMessages = [];
    }

    setMessages(userMessages);
  };

  var scrollToBottom = function() {
    var el = document.getElementById('chatMessages');

    el.scrollTo({top: el.scrollHeight, behavior: 'smooth'});
  };

  useEffect(handleMessages, [st.user, chatWith]);
  useEffect(scrollToBottom, [messages]);

  return (
    <div id='chatMessages' className='chatMessages v'>
      {renderMessages()}
    </div>
  );
};

export default ChatMessages;