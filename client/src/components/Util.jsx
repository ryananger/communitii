import React, {lazy, useEffect, useState} from 'react';
import {AiOutlineLogout as Out,
        AiOutlineLogin as In,
        AiFillSetting as SettingsIcon} from 'react-icons/ai';
import {IoMdNotifications as NotificationsIcon} from 'react-icons/io';

import st from 'ryscott-st';
import {helpers} from 'util';

const Util = function({user}) {
  const [showNotifications, setShowNotifications] = useState(false);

  var renderNotifications = function() {
    var rendered = [];

    user.notifications.map(function(entry, i) {
      console.log(entry);

      rendered.push(<div key={i} className='notificationInfo h'>{entry.text}</div>);
    });

    return (
      <div className='notificationsTab v'>
        {rendered}
      </div>
    );
  };

  var handleLogin = function() {
    if (user) {
      helpers.logOut();
    } else {
      st.setView('login');
    }
  };

  useEffect(()=>{
    if (!user) {
      setShowNotifications(false);
    }
  }, [user]);

  return (
    <div className='util h'>
      {user && showNotifications && renderNotifications()}
      <div className='notificationButton grow v c' onClick={()=>{setShowNotifications(!showNotifications)}}>
        <NotificationsIcon size={32}/>
        {user && user.notifications.length > 0 && <div className='notifyIndicator'/>}
      </div>
      <SettingsIcon className='utilButton grow' size={26}/>
      <div className='loginButton grow v c' onClick={handleLogin}>{user ? <Out size={30}/> : <In size={30}/>}</div>
    </div>
  );
};

export default Util;

