import React, {lazy, useEffect, useState} from 'react';

import st from 'ryscott-st';
import {helpers} from 'util';

const messages = [
  { user: "John", message: "To live or not to live, that's the real question, isn't it?" },
  { user: "Al", message: "What's bothering you, John? You seem lost in thought." },
  { user: "John", message: "Life's a crazy ride, Al. And the crazy part is, no one really knows where it leads." },
  { user: "Al", message: "True, life can be unpredictable. But surely, there's a purpose to it all?" },
  { user: "John", message: "That's the thing. We wrestle with troubles, endure heartaches, but what's the grand plan, if any?" },
  { user: "Al", message: "Maybe we're here to make our own meaning, find joy in the small moments." },
  { user: "John", message: "But what if those moments are just fleeting illusions in this chaotic drama?" },
  { user: "Al", message: "Then let's savor them while we can, John, and create our own story amidst the uncertainty." },
  { user: "John", message: "It's like we're actors on a crazy stage, improvising our way through this wild existence." },
  { user: "Al", message: "Exactly! Life's a play, and we're the co-authors of our own scenes." },
  { user: "John", message: "So, let's embrace the unknown, Al, and dance to the rhythm of our own narrative." }
];

const Chat = function({user}) {
  var renderMessages = function() {
    var rendered = [];

    messages.map(function(message, i) {
      rendered.push(
        <div key={message.user + '_' + i} className='messageEntry h'>
          {/* <b>{message.user.slice(0, 2)}:</b> */}
          {message.message}
        </div>
      );
    })

    return rendered;
  };

  return (
    <div className='chatBox v'>
      <div className='chatMessages v'>
        {renderMessages()}
      </div>
      <div className='chatInputContainer'>
        <textarea className='chatInput'/>
      </div>
    </div>
  );
};

export default Chat;

