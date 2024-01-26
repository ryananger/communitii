import React, {lazy, useEffect, useState} from 'react';
import {AiOutlineLogout as Out,
        AiOutlineLogin as In,
        AiFillSetting as SettingsIcon} from 'react-icons/ai';
import {BsPersonCircle as ProfileIcon} from 'react-icons/bs';
import {IoMdNotifications as NotificationsIcon} from 'react-icons/io';

import st from 'ryscott-st';
import {ax, helpers} from 'util';

const Util = function({user}) {
  const [showNotifications, setShowNotifications] = useState(false);

  var noteButtons = function(note) {
    switch (note.type) {
      case 'friendRequest':
        return (
          <div className='noteButtonContainer h'>
            <div className='noteButton yes grow v c' onClick={()=>{ax.addFriend(st.user, note.uid, 'confirm')}}>confirm</div>
            <div className='noteButton no grow v c' onClick={()=>{ax.addFriend(st.user, note.uid, 'deny')}}>deny</div>
          </div>
        );
      case 'friendPending':
        return (
          <div className='noteButtonContainer h'>
            <div className='noteButton no grow v c' onClick={()=>{ax.addFriend(st.user, note.uid, 'cancel')}}>cancel</div>
          </div>
        );
    }
  };

  var renderNotifications = function() {
    var rendered = [];

    user.notifications.map(function(entry, i) {
      var render = (
        <div key={i} className='notificationInfo v'>
          {entry.text}
          {noteButtons(entry)}
        </div>
      );

      rendered.push(render);
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
      <div className='utilButton anchor grow v c' onClick={handleNotification}>
        <NotificationsIcon size={32}/>
        {user && checkUnread() && <div className='notifyIndicator'/>}
      </div>
      <ProfileIcon className='utilButton grow' onClick={()=>{st.setView('userProfile')}} size={24}/>
      <SettingsIcon className='utilButton grow' size={26}/>
      <div className='utilButton grow v c' onClick={handleLogin}>{user ? <Out size={30}/> : <In size={30}/>}</div>
    </div>
  );
};

export default Util;

