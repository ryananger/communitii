import React, {lazy, useEffect, useState} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

import ChatMessages from './ChatMessages.jsx';
import ChatInput from './ChatInput.jsx';

const ChatWith = function() {
  const chatWith = st.chatWith;
  const expanded = st.view === 'chat';

  var handleExpand = function() {
    st.lastView = st.view;
    st.setView('chat');
  };

  return (
    <div className={`chatBox ${expanded ? 'card' : ''} v`}>
      {!expanded && <icons.BackIcon className='chatBack' size={24} onClick={()=>{st.setChatWith(null)}}/>}
      {!expanded && <icons.ExpandIcon className='chatExpand' size={20} onClick={handleExpand}/>}
      {expanded  && <icons.CloseIcon className='chatExpand' size={20} onClick={()=>{st.setView(st.lastView)}}/>}
      <div className={`chatUserInfo ${expanded ? 'chatUserInfoExpanded' : ''} v`} onClick={()=>{chatWith !== 'community' && ax.getProfile(chatWith.uid)}}>
        {chatWith !== 'community' && chatWith.settings.pfp && <img className='chatThumb' src={chatWith.settings.pfp}/>}
        {chatWith === 'community' ? st.community.name : chatWith.username}
      </div>
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default ChatWith;