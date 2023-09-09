import React, {lazy, useEffect, useState} from 'react';
import {AiOutlineLogout as Out,
        AiOutlineLogin as In,
        AiFillSetting as SettingsIcon} from 'react-icons/ai';
import {IoMdNotifications as NotificationsIcon} from 'react-icons/io';

import st from 'ryscott-st';
import {ax, helpers} from 'util';

const Util = function({user}) {
  const [showNotifications, setShowNotifications] = useState(false);

  var renderNotifications = function() {
    var rendered = [];

    user.notifications.map(function(entry, i) {
      rendered.push(<div key={i} className='notificationInfo h'>{entry.text}</div>);
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

    setShowNotifications(!showNotifications)
  };

  var handleLogin = function() {
    if (user) {
      helpers.logOut();
    } else {
      st.setView('login');
    }
  };

  var checkUnread = function() {
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
      <div className='notificationButton grow v c' onClick={handleNotification}>
        <NotificationsIcon size={32}/>
        {user && checkUnread() && <div className='notifyIndicator'/>}
      </div>
      <SettingsIcon className='utilButton grow' size={26}/>
      <div className='loginButton grow v c' onClick={handleLogin}>{user ? <Out size={30}/> : <In size={30}/>}</div>
    </div>
  );
};

export default Util;

