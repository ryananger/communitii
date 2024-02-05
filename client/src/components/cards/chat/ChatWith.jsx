import React, {lazy, useEffect, useState} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

const ChatWith = function() {
  const chatWith = st.chatWith;
  const [messages, setMessages] = useState([]);
  const expanded = st.view === 'chat';

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
      var dateText = helpers.chatDate(thisDate);
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

  var sendMessage = function(text) {
    var message = {
      user: st.user._id,
      text: text,
      sentTo: chatWith._id || st.community._id,
      media: [],

      createdOn: new Date().toISOString()
    };

    if (chatWith === 'community') {
      ax.sendCommunityMessage(message);
    } else {
      ax.sendMessage(message);
    }

    setMessages([...messages, {...message, user: st.user}]);
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

  var handleExpand = function() {
    st.lastView = st.view;
    st.setView('chat');
  };

  useEffect(()=>{
    document.getElementById('chatInput').focus();
  }, [chatWith]);
  useEffect(handleMessages, [st.user, chatWith]);
  useEffect(scrollToBottom, [messages]);

  return (
    <div className={`chatBox ${expanded ? 'card' : ''} v`}>
      {!expanded && <icons.BackIcon className='chatBack' size={24} onClick={()=>{st.setChatWith(null)}}/>}
      {!expanded && <icons.ExpandIcon className='chatExpand' size={20} onClick={handleExpand}/>}
      {expanded && <icons.CloseIcon className='chatExpand' size={20} onClick={()=>{st.setView(st.lastView)}}/>}
      <div className={`chatUserInfo ${expanded ? 'chatUserInfoExpanded' : ''} v`} onClick={()=>{chatWith !== 'community' && ax.getProfile(chatWith.uid)}}>
        {chatWith !== 'community' && chatWith.settings.pfp && <img className='chatThumb' src={chatWith.settings.pfp}/>}
        {chatWith === 'community' ? st.community.name : chatWith.username}
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