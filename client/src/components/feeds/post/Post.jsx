import React, {lazy, useEffect, useState} from 'react';

import st from 'ryscott-st';
import icons from 'icons';
import {ax} from 'util';

import PostHead from './PostHead.jsx';
import PostInteract from './PostInteract.jsx';
import PostReply from './PostReply.jsx';
import ReplyInteract from './ReplyInteract.jsx';

const Post = function({post}) {
  const [showReply, setShowReply] = useState(st.view === 'postView');
  const [mediaFull, setMediaFull] = useState(false);

  var handleMedia = function(media, type) {
    var rendered = [];

    media.map(function(entry, i) {
      var handleClick = ()=>{setMediaFull({media: media, index: i})};
      var tag = i !== 0 ? 'Small' : '';

      if (entry.type === 'image') {
        rendered.push(<img key={i} className={`${type}${tag}Image`} src={entry.url} onClick={handleClick} />);
      } else {
        rendered.push(<video key={i} className={`${type}${tag}Video`} src={entry.url} onClick={handleClick} controls/>);
      }
    })

    return rendered;
  };

  var renderReplies = function() {
    if (!post.replies) {return};

    var rendered = [];

    post.replies.map(function(reply, i) {
      rendered.push(
        <div key={'reply' + i} className='replyBody v'>
          <PostHead post={reply} reply/>
          {reply.text && <div className='replyContent v'>{reply.text}</div>}
          {reply.media[0] && <div className='replyMedia h'>{handleMedia(reply.media, 'reply')}</div>}
          <ReplyInteract post={reply}/>
        </div>
      )
    })

    return rendered;
  };

  var renderMediaFull = function() {
    var handleClick = function(e, type) {
      var val = type === 'next' ? 1 : -1;

      e.stopPropagation();
      setMediaFull({...mediaFull, index: mediaFull.index + val});
    };

    return (
      <div id='mediaModal' className='mediaModal h' onClick={()=>{setMediaFull(null)}}>
        <div style={{width: '48px', cursor: 'pointer'}}>
          {mediaFull.index > 0 && <icons.PrevIcon onClick={(e)=>{handleClick(e, 'prev')}}/>}
        </div>
        {handleMedia([mediaFull.media[mediaFull.index]], 'full')}
        <div style={{width: '48px', cursor: 'pointer'}}>
          {mediaFull.media.length > 1 && mediaFull.index < mediaFull.media.length - 1 && <icons.NextIcon onClick={(e)=>{handleClick(e, 'next')}}/>}
        </div>
      </div>
    )
  };

  return (
    <div className='post v'>
      <PostHead post={post}/>
      {post.text && <div className='postContent v'>{post.text}</div>}
      {post.media[0] && <div className='postMedia h'>{handleMedia(post.media, 'post')}</div>}
      <PostInteract post={post} showReply={showReply} setShowReply={setShowReply}/>
      {showReply && renderReplies()}
      {showReply && <PostReply post={post}/>}

      {mediaFull && renderMediaFull()}
    </div>
  );
};

export default Post;

