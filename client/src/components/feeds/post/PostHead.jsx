import React, {useState, useEffect, useRef} from 'react';
import st from 'ryscott-st';
import {ax, helpers} from 'util';
import ProfileCard from '../profile/ProfileCard.jsx';
import Options from '../Options.jsx';

const PostHead = function({post, reply}) {
  const [showCard, setShowCard] = useState(false);
  const el = useRef(null);

  const timeSince = helpers.timeSince(new Date(post.createdOn));
  const timeText1 = timeSince ? timeSince  + ' ago' : 'now';
  const timeText2 = helpers.getDate(new Date(post.createdOn));

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
        <div className='postDate'>
          <small className='timeText1 v'>{timeText1}</small>
          <small className='timeText2 v'>{timeText2}</small>
        </div>
        {userPost && !reply && <Options entry={post} type={'post'}/>}
      </div>
    </div>
  )
};

export default PostHead;