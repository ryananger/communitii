import React, {lazy, useEffect, useState} from 'react';
import {BsPersonCircle as ProfileIcon} from 'react-icons/bs';
import {IoMdChatbubbles as MessageIcon} from 'react-icons/io';

import st from 'ryscott-st';
import {helpers} from 'util';

var friends = [
  {user: 'John', status: 'online'},
  {user: 'Jacob', status: 'online'},
  {user: 'Jingleheimer', status: 'online'},
  {user: 'Schmidt', status: 'dnd'},
  {user: 'Old McDonald', status: 'online'},
  {user: 'Farm', status: 'away'},
  {user: 'Ee eye ee eye', status: 'online'},
  {user: 'Oh', status: 'dnd'},
  {user: 'Albert Einstein', status: 'off'},
  {user: 'Socrates', status: 'off'}
];

const Friends = function({user}) {
  var renderFriends = function() {
    var rendered = [];

    friends.map(function(friend) {
      var color;

      switch(friend.status) {
        case 'online':
          color = 'grow';
          break;
        case 'away':
          color = 'learn';
          break;
        case 'dnd':
          color = 'work';
          break;
        case 'off':
          color = 'home';
          break;
      }

      rendered.push(
        <div key={friend.user} className='friendEntry h'>
          <div className='friendStatus' style={{backgroundColor: `var(--${color})`}}/>
          {friend.user}
          <div className='friendListIcons h'>
            <ProfileIcon className='friendListIcon grow'/>
            {friend.status !== 'dnd' && <MessageIcon className='friendListIcon grow'/>}
          </div>
        </div>
      );
    })

    return rendered;
  };

  return (
    <div className='friendsList full v'>
      {renderFriends()}
    </div>
  );
};

export default Friends;

