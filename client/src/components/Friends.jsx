import React, {lazy, useEffect, useState} from 'react';

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
  {user: 'Albert Einstein', status: 'away'},
  {user: 'Socrates', status: 'away'}
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
      }

      rendered.push(
        <div key={friend.user} className='friendEntry h'>
          <div className='friendStatus' style={{backgroundColor: `var(--${color})`}}/>
          {friend.user}
        </div>
      );
    })

    return rendered;
  };

  return (
    <div className='friends card v'>
      <div className='friendsHead h'>
        friends
      </div>
      <div className='friendsList full v'>
        {renderFriends()}
      </div>
    </div>
  );
};

export default Friends;

