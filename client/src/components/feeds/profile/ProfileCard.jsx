import React, {lazy, useEffect, useState} from 'react';
import {BsPersonFillAdd as AddIcon,
        BsPersonFillExclamation as PendIcon,
        BsPersonFillCheck as FriendIcon} from 'react-icons/bs';
import {BiSolidMessage as MessageIcon, BiSolidUserCircle as UserIcon} from 'react-icons/bi';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, helpers, firebase} from 'util';

import ProfilePic from './ProfilePic.jsx';

const ProfileCard = function({user, onProfile}) {
  const [popup, setPopup] = useState(null);

  const info = user.settings || {pfp: '', headline: '', bio: ''};
  const otherUser = user.uid !== st.user.uid;
  const isFriend = function() {
    var result;

    st.user.friends.map(function(friend) {
      if (friend.uid.includes('pending.')) {return};

      if (friend.uid === user.uid) {
        result = true;
      }
    })

    return result;
  }();

  const pendingFriend = function() {
    var result;

    st.user.friends.map(function(friend) {
      if (friend.uid.includes('pending.')) {
        result = true;
      }
    })

    return result;
  }();

  const isSender = function() {
    var result = false;

    st.user.notifications.map(function(entry) {
      if (entry.type === 'friendPending' && entry.uid === user.uid) {
        result = true;
      }
    })

    return result;
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
      return <icons.AddFriendIcon className='utilButton grow' onClick={()=>{handlePopup('add')}} size={24}/>;
    } else if (pendingFriend) {
      return <icons.PendFriendIcon className='utilButton grow' onClick={()=>{handlePopup('pend')}} size={24}/>;
    } else if (isFriend) {
      return <icons.FriendIcon className='utilButton grow' onClick={()=>{handlePopup('friend')}} size={24}/>;
    }
  };

  var handleMessage = function() {
    var userInfo = {
      _id: user._id,
      uid: user.uid,
      username: user.username,
      posts: user.posts,
      settings: info
    };

    st.setChatWith(userInfo);
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
          {otherUser && <icons.MessageIcon className='utilButton grow' onClick={handleMessage} size={24}/>}
          {!onProfile && <icons.UserIcon className='utilButton grow' onClick={handleProfile} size={24}/>}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

