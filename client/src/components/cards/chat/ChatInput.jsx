import React, {lazy, useEffect, useState, useRef} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

import ImageUpload from '../../feeds/ImageUpload.jsx';

const ChatInput = function() {
  const [uploads, setUploads] = useState([]);
  const inputEl = useRef(null);
  const chatWith = st.chatWith;

  var sendMessage = function(text) {
    if (!text && !uploads[0]) {return};

    var message = {
      user: st.user._id,
      text: text,
      sentTo: chatWith._id || st.community._id,
      media: [],

      createdOn: new Date().toISOString()
    };

    var send = function() {
      if (chatWith === 'community') {
        ax.sendCommunityMessage(message);
      } else {
        ax.sendMessage(message);
      }

      inputEl.current.value = '';
      st.setMessages([...st.messages, {...message, user: st.user}]);
      setUploads([]);
    };

    if (uploads[0]) {
      helpers.uploadMedia(uploads, message.media, send);
    } else {
      send();
    }
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
    <div className='chatInputContainer v'>
      <ImageUpload uploads={uploads} setUploads={setUploads} id='chat'/>
      <div className='h' style={{width: '100%'}}>
        <textarea ref={inputEl} className='chatInput' onKeyDown={handleInput} onFocus={handleFocus}/>
        <div className='chatInputButtons v'>
          <icons.AddPhotosIcon className='chatInputButton grow' size={28} onClick={()=>{document.getElementById('chatImageInput').click()}}/>
          <icons.SendIcon className='chatInputButton grow' size={28} onClick={()=>{sendMessage(inputEl.current.value)}}/>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;