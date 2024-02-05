import React, {lazy, useEffect, useState} from 'react';
import icons from 'icons';

import st from 'ryscott-st';
import {ax, helpers} from 'util';

const Util = function({user}) {
  const [showNotifications, setShowNotifications] = useState(false);

  var noteButtons = function(note) {
    switch (note.type) {
      case 'friendRequest':
        return (
          <div className='noteButtonContainer h'>
            <div className='noteButton yes v c' onClick={()=>{ax.addFriend(st.user, note.uid, 'confirm')}}>confirm</div>
            <div className='noteButton no v c' onClick={()=>{ax.addFriend(st.user, note.uid, 'deny')}}>deny</div>
          </div>
        );
      case 'friendPending':
        return (
          <div className='noteButtonContainer h'>
            <div className='noteButton no v c' onClick={()=>{ax.addFriend(st.user, note.uid, 'cancel')}}>cancel</div>
          </div>
        );
    }
  };

  var renderNotifications = function() {
    var rendered = [];
    var dupCheck = [];

    user.notifications.map(function(entry, i) {
      var dupString = `${entry.type}.${entry._id || entry.uid}.${entry.text}`;
      if (dupCheck.indexOf(dupString) !== -1) {return};

      dupCheck.push(dupString);

      var handleClick = function() {
        ['friendConfirmed', 'friendAdded'].includes(entry.type) && ax.getProfile(entry.uid);
        entry.type === 'newReply' && ax.getPost(entry._id);
      };

      var render = (
        <div key={i} className='notificationInfo v' onClick={handleClick}>
          {entry.text}
          {noteButtons(entry)}
        </div>
      );

      rendered.unshift(render);
    });

    return (
      <div className='notificationsTab v'>
        {rendered}
      </div>
    );
  };

  var handleNotification = function() {
    if (!showNotifications) {
      ax.readNotifications();
    }

    setShowNotifications(!showNotifications);
  };

  var handleLogin = function() {
    if (user) {
      st.setView('find');
      helpers.logOut();
    } else {
      st.setView('login');
    }
  };

  var checkUnread = function() {
    if (!user.notifications[0]) {return};

    for (var i = 0; i < user.notifications.length; i++) {
      var entry = user.notifications[i];

      if (!entry.read) {
        return true;
      }
    }

    return false;
  };

  useEffect(()=>{
    if (!user) {
      setShowNotifications(false);
    }
  }, [user]);

  return (
    <div className='util h'>
      {user && showNotifications && renderNotifications()}
      <div className='utilButton anchor grow v c' onClick={user && handleNotification}>
        <icons.NotificationsIcon size={32}/>
        {user && checkUnread() && <div className='notifyIndicator'/>}
      </div>
      <icons.ProfileIcon className='utilButton grow' onClick={()=>{user && st.setView('userProfile')}} size={24}/>
      <icons.SettingsIcon className='utilButton grow' size={26}/>
      <div className='utilButton grow v c' onClick={handleLogin}>{user ? <icons.LogoutIcon size={30}/> : <icons.LoginIcon size={30}/>}</div>
    </div>
  );
};

export default Util;

