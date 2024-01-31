import React, {lazy, useEffect, useState} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

const ChatWith = function() {
  const chatWith = st.chatWith;
  const [messages, setMessages] = useState([]);

  var renderMessages = function() {
    var rendered = [];
    var current = null;

    messages.map(function(message, i) {
      var userSent = message.sentBy === st.user.uid;
      var tag = `${userSent ? 'userSent' : 'friendSent'}`;
      var msgHead = userSent ? st.user.username : chatWith.username;
      var addHead = current === message.sentBy ? false : true;

      rendered.push(
        <div key={message.sentBy + i} className='messageEntry v'>
          {addHead &&
            <div className={`messageHead ${tag} v`} style={i === 0 ? {borderTop: 'none', marginTop: '0'}: {}}>
              {msgHead}
            </div>
          }
          <div className={`messageText ${tag} v`}>{message.text}</div>
        </div>
      );

      current = message.sentBy;
    })

    return rendered;
  };

  var handleUserMessages = function() {
    var userMessages;

    if (st.user.messages && st.user.messages[chatWith.uid]) {
      userMessages = st.user.messages[chatWith.uid].messages;

      if (st.user.messages[chatWith.uid].unread > 0) {
        ax.readMessages(chatWith.uid);
      }
    } else {
      userMessages = [];
    }

    if (messages.length !== userMessages.length) {
      setMessages(userMessages);
    }
  };

  var sendMessage = function(text) {
    var message = {
      createdOn: new Date().toISOString(),
      text: text,
      sentBy: st.user.uid,
      sentTo: chatWith ? chatWith.uid : null,
      media: []
    };

    ax.sendMessage(message);
  };

  var handleInput = function(e) {
    var input = document.getElementById('chatInput');

    if (!input.value.split('\n')[0] && !input.value.split('\n')[1]) {return};

    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();

        sendMessage(input.value);
        input.value = '';
      }
    }
  };

  var scrollToBottom = function() {
    var el = document.getElementById('chatMessages');

    el.scrollTo({top: el.scrollHeight, behavior: 'smooth'});
  };

  var handleFocus = function() {
    document.getElementById('chatCard').style = "flex: 1 1 auto;";
  };

  useEffect(()=>{
    document.getElementById('chatInput').focus();
  }, [chatWith]);
  useEffect(handleUserMessages, [st.user, chatWith]);
  useEffect(scrollToBottom, [messages]);

  return (
    <div className='chatBox v'>
      <icons.BackIcon className='chatBack' size={24} onClick={()=>{st.setChatWith(null)}}/>
      <div className='chatUserInfo v' onClick={()=>{ax.getProfile(chatWith.uid)}}>
        {chatWith.settings.pfp && <img className='chatThumb' src={chatWith.settings.pfp}/>}
        {chatWith.username}
      </div>
      <div id='chatMessages' className='chatMessages v'>
        {renderMessages()}
      </div>
      <div className='chatInputContainer v'>
        <textarea id='chatInput' className='chatInput' onKeyDown={handleInput} onFocus={handleFocus}/>
        {/* <icons.SendIcon size={30}/> */}
      </div>
    </div>
  );
};

export default ChatWith;

