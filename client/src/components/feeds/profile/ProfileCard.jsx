import React, {lazy, useEffect, useState} from 'react';
import {BsPersonFillAdd as AddIcon,
        BsPersonFillExclamation as PendIcon,
        BsPersonFillCheck as FriendIcon} from 'react-icons/bs';
import {BiSolidMessage as MessageIcon, BiSolidUserCircle as UserIcon} from 'react-icons/bi';
import st from 'ryscott-st';
import {ax, helpers, firebase} from 'util';

import ProfilePic from './ProfilePic.jsx';

const ProfileCard = function({user, onProfile}) {
  const [popup, setPopup] = useState(null);

  const info = user.settings || {pfp: '', headline: '', bio: ''};
  const otherUser = user.uid !== st.user.uid;
  const isFriend = st.user.friends.includes(user.uid);
  const pendingFriend = st.user.friends.includes('pending.' + user.uid);
  const isSender = function() {
    var isSender = false;

    st.user.notifications.map(function(entry) {
      if (entry.type === 'friendPending' && entry.uid === user.uid) {
        isSender = true;
      }
    })

    return isSender;
  }();

  var handleProfile = function() {
    if (!otherUser) {
      st.setView('userProfile');
    } else {
      ax.getPostsForUser(user);
    }
  };

  var friendPopup = function() {
    if (!popup) {return};

    var render = (
      <div className='friendPopup float'>
        <div className='friendPopupOptions v'>
          {popup.options.map(function(option, i) {
            var cl = `popupOption ${option.type} grow v c`;

            return (
              <div key={'option' + i} className={cl} onClick={option.cb}>
                <small>{option.text}</small>
              </div>
            );
          })}
        </div>
      </div>
    );

    return render;
  };

  var handleAdd = function() {
    setPopup(null);
    helpers.alert('Friend request sent!');
    ax.addFriend(st.user, user.uid, 'send');
  };

  var handleCancel = function() {
    setPopup(null);
    helpers.alert('Friend request canceled.');
    ax.addFriend(st.user, user.uid, 'cancel');
  };

  var handleUnfriend = function() {
    setPopup(null);
    helpers.alert(`Unfriended ${user.username}.`);
    ax.unfriend(st.user, user.uid);
  };

  var handlePopup = function(type) {
    switch (type) {
      case 'add':
        var option = {
          text: 'add friend?',
          type: 'yes',
          cb: handleAdd
        };

        setPopup({options: [option]});
        break;
      case 'pend':
        if (isSender) {
          var option = {
            text: 'cancel?',
            type: 'no',
            cb: handleCancel
          };

          setPopup({options: [option]});
        }
        break;
      case 'friend':
        var option = {
          text: 'unfriend?',
          type: 'no',
          cb: handleUnfriend
        };

        setPopup({options: [option]});
        break;
    };
  };

  var handleFriendIcon = function() {
    if (otherUser && !isFriend && !pendingFriend) {
      return <AddIcon className='utilButton grow' onClick={()=>{handlePopup('add')}} size={24}/>;
    } else if (pendingFriend) {
      return <PendIcon className='utilButton grow' onClick={()=>{handlePopup('pend')}} size={24}/>;
    } else if (isFriend) {
      return <FriendIcon className='utilButton grow' onClick={()=>{handlePopup('friend')}} size={24}/>;
    }
  };

  return (
    <div className={`card ${onProfile ? 'profileHead' : 'profileCard'} h`}>
      <div className='profileLeft v' onClick={handleProfile}>
        <ProfilePic url={info.pfp ? info.pfp : null} isStatic={true}/>
        <b>{user.username}</b>
      </div>
      <div className='bio v'>
        <div className='v' style={{width: '100%', alignItems: 'flex-start'}}>
          <h4>{info.headline ? info.headline : ''}</h4>
          <small>{info.bio ? info.bio : ''}</small>
        </div>
        <div className='anchor h' style={{width: '100%', justifyContent: 'flex-end'}}>
          {handleFriendIcon()}
          {friendPopup()}
          {otherUser && <MessageIcon className='utilButton grow' size={24}/>}
          {!onProfile && <UserIcon className='utilButton grow' onClick={handleProfile} size={24}/>}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
