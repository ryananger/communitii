import React, {useState, useEffect} from 'react';
import st from 'ryscott-st';
import {ax, helpers} from 'util';
import ProfileCard from '../profile/ProfileCard.jsx';
import Options from '../Options.jsx';

const PostHead = function({post}) {
  const [showCard, setShowCard] = useState(false);

  const timeSince = helpers.timeSince(new Date(post.createdOn))
  const timeText =  timeSince ? timeSince  + ' ago' : 'now';

  const user = post.user;
  const settings = post.user.settings || {};

  var handleUser = function() {
    var postInfo = '';

    if (['home', 'profile', 'userProfile'].includes(st.view)) {
      postInfo = `in ${post.feed}`;
    }

    if (showCard) {
      return (
        <div className='cardContainer' onMouseLeave={()=>{setShowCard(false)}}>
          <ProfileCard user={user}/>
        </div>
      )
    } else {
      return (
        <div className='postUser h c' onMouseEnter={()=>{setShowCard(true)}}>
          {settings.pfp && <img className='pfpThumb' src={settings.pfp}/>}
          <b>{user.username}</b>
          <small className='postInfo h'>{postInfo}</small>
        </div>
      )
    }
  };

  return (
    <div className='postHead h'>
      {handleUser()}
      <div className='h' style={{alignItems: 'center'}}>
        <div className='postDate'><small>{timeText}</small></div>
        <Options post={post}/>
      </div>
    </div>
  )
};

export default PostHead;