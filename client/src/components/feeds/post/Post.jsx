import React, {lazy, useEffect, useState} from 'react';

import st from 'ryscott-st';
import icons from 'icons';
import {ax} from 'util';

import PostHead from './PostHead.jsx';
import PostInteract from './PostInteract.jsx';
import PostReply from './PostReply.jsx';
import ReplyInteract from './ReplyInteract.jsx';

const Post = function({post}) {
  const [showReply, setShowReply] = useState(false);
  const [mediaFull, setMediaFull] = useState(false);

  var handleMedia = function(media, type) {
    var rendered = [];

    media.map(function(entry, i) {
      var handleClick = ()=>{setMediaFull({media: media, index: i})};

      if (entry.type === 'image') {
        rendered.push(<img id={post._id + 'media' + i} key={i} className={`${type}Image`} src={entry.url} onClick={handleClick} />);
      } else {
        rendered.push(<video id={post._id + 'media' + i} key={i} className={`${type}Video`} src={entry.url} onClick={handleClick} controls/>);
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
          <div className='replyHead'><small><b>{reply.user.username}</b></small></div>
          {reply.text && <div className='replyContent v'>{reply.text}</div>}
          {reply.media[0] && <div className='replyMedia h'>{handleMedia(reply.media, 'reply')}</div>}
          <ReplyInteract post={reply}/>
        </div>
      )
    })

    return rendered;
  };

  var renderMediaFull = function() {
    var prevClick = function(e) {
      e.stopPropagation();
      setMediaFull({...mediaFull, index: mediaFull.index - 1});
    };

    var nextClick = function(e) {
      e.stopPropagation();
      setMediaFull({...mediaFull, index: mediaFull.index + 1});
    };

    return (
      <div id='mediaModal' className='mediaModal h' onClick={()=>{setMediaFull(null)}}>
        <div style={{width: '48px'}}>
          {mediaFull.index > 0 && <icons.PrevIcon onClick={prevClick}/>}
        </div>
        {handleMedia([mediaFull.media[mediaFull.index]], 'full')}
        <div style={{width: '48px'}}>
          {mediaFull.media.length > 1 && mediaFull.index < mediaFull.media.length - 1 && <icons.NextIcon onClick={nextClick}/>}
        </div>
      </div>
    )
  };

  return (
    <div className='post v'>
      <PostHead post={post}/>
      {post.text && <div className='postContent v'>{post.text}</div>}
      {post.media[0] && <div className='postMedia v'>{handleMedia(post.media, 'post')}</div>}
      <PostInteract post={post} showReply={showReply} setShowReply={setShowReply}/>
      {showReply && renderReplies()}
      {showReply && <PostReply post={post}/>}

      {mediaFull && renderMediaFull()}
    </div>
  );
};

export default Post;

