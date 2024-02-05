import React, {lazy, useEffect, useState, useRef} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax} from 'util';

const ChatInput = function() {
  const chatWith = st.chatWith;
  const inputEl = useRef(null);

  var sendMessage = function(text) {
    if (!text) {return};

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

    inputEl.current.value = '';
    st.setMessages([...st.messages, {...message, user: st.user}]);
  };

  var handleInput = function(e) {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();

        sendMessage(inputEl.current.value);
      }
    }
  };

  var handleFocus = function() {
    document.getElementById('chatCard').style = "flex: 1 1 auto;";
  };

  useEffect(()=>{
    inputEl.current.focus();
  }, [chatWith]);

  return (
    <div className='chatInputContainer h'>
      <textarea ref={inputEl} className='chatInput' onKeyDown={handleInput} onFocus={handleFocus}/>
      <div className='chatInputButtons v'>
        <icons.AddPhotosIcon className='chatInputButton grow' size={28}/>
        <icons.SendIcon className='chatInputButton grow' size={28} onClick={()=>{sendMessage(inputEl.current.value)}}/>
      </div>
    </div>
  );
};

export default ChatInput;