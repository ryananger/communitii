import React, {lazy, useEffect, useState} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

const defaultMessages = [
  { sentBy: "John", text: "To live or not to live, that's the real question, isn't it?" },
  { sentBy: "Al", text: "What's bothering you, John? You seem lost in thought." },
  { sentBy: "John", text: "Life's a crazy ride, Al. And the crazy part is, no one really knows where it leads." },
  { sentBy: "Al", text: "True, life can be unpredictable. But surely, there's a purpose to it all?" },
  { sentBy: "John", text: "That's the thing. We wrestle with troubles, endure heartaches, but what's the grand plan, if any?" },
  { sentBy: "Al", text: "Maybe we're here to make our own meaning, find joy in the small moments." },
  { sentBy: "John", text: "But what if those moments are just fleeting illusions in this chaotic drama?" },
  { sentBy: "Al", text: "Then let's savor them while we can, John, and create our own story amidst the uncertainty." },
  { sentBy: "John", text: "It's like we're actors on a crazy stage, improvising our way through this wild existence." },
  { sentBy: "Al", text: "Exactly! Life's a play, and we're the co-authors of our own scenes." },
  { sentBy: "John", text: "So, let's embrace the unknown, Al, and dance to the rhythm of our own narrative." }
];

const Chat = function() {
  const [chatWith, setChatWith] = st.newState('chatWith', useState(null));
  const [messages, setMessages] = useState(defaultMessages);

  var renderMessages = function() {
    var rendered = [];
    var current = null;

    messages.map(function(message, i) {
      var userSent = message.sentBy === st.user.uid;
      var tag = `${userSent ? 'userSent' : 'friendSent'}`;
      var msgHead = userSent ? st.user.username : chatWith ? chatWith.username : message.sentBy;
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
    if (!chatWith) {return};

    var msgs = [];

    st.user.messages.map(function(msg) {
      if (msg.sentBy === chatWith.uid || msg.sentTo === chatWith.uid) {
        msgs.push(msg);
      }
    })

    if (messages.length !== msgs.length) {
      setMessages(msgs);
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

  useEffect(()=>{document.getElementById('chatInput').focus()}, [chatWith]);
  useEffect(handleUserMessages, [st.user, chatWith]);
  useEffect(scrollToBottom, [messages]);

  return (
    <div className='chatBox v'>
      {chatWith && <div className='chatUserInfo v'>
        {chatWith.username}
      </div>}
      <div id='chatMessages' className='chatMessages v'>
        {renderMessages()}
      </div>
      <div className='chatInputContainer v'>
        <textarea id='chatInput' className='chatInput' onKeyDown={handleInput}/>
        {/* <icons.SendIcon size={30}/> */}
      </div>
    </div>
  );
};

export default Chat;

