import React, {useState, useEffect, useRef} from 'react';
import st from 'ryscott-st';
import {ax, helpers} from 'util';
import ProfileCard from '../profile/ProfileCard.jsx';
import Options from '../Options.jsx';

const PostHead = function({post, reply}) {
  const [showCard, setShowCard] = useState(false);
  const el = useRef(null);

  const timeSince = helpers.timeSince(new Date(post.createdOn));
  const timeText =  timeSince ? timeSince  + ' ago' : 'now';

  const user = post.user;
  const userPost = st.user.uid === post.user.uid;
  const settings = post.user.settings || {};

  const pfpEl = <img className='pfpThumb' src={settings.pfp}/>;

  var handleUser = function() {
    var postInfo = '';

    if (!reply && ['home', 'profile', 'userProfile'].includes(st.view)) {
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
          {settings.pfp && pfpEl}
          <b>{user.username}</b>
          <small className='postInfo h'>{postInfo}</small>
        </div>
      )
    }
  };

  var handleClick = async function(e) {
    if (reply) {return};

    e.target === el.current && ax.getPost(post._id);
  };

  return (
    <div className={`postHead ${reply ? 'replyHead': ''} h`} ref={el} style={{backgroundColor: `var(--${post.feed})`}} onClick={handleClick}>
      {handleUser()}
      <div className='h' style={{alignItems: 'center'}}>
        <div className='postDate'><small>{timeText}</small></div>
        {userPost && !reply && <Options post={post}/>}
      </div>
    </div>
  )
};

export default PostHead;