import React, {lazy, useEffect, useState} from 'react';
import {IoMdSend as Send,
        IoMdHeart as Like} from 'react-icons/io';
import st from 'ryscott-st';
import {ax} from 'util';

import PostHead from './PostHead.jsx';
import PostInteract from './PostInteract.jsx';
import PostReply from './PostReply.jsx';
import ReplyInteract from './ReplyInteract.jsx';

const Post = function({post}) {
  const [showReply, setShowReply] = useState(false);

  var handleMedia = function(media, type) {
    var rendered = [];

    media.map(function(entry, i) {
      if (entry.type === 'image') {
        rendered.push(<img key={i} className={`${type}Image`} src={entry.url}/>);
      } else {
        rendered.push(<video key={i} className={`${type}Video`} src={entry.url} controls/>);
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

  return (
    <div className='post v'>
      <PostHead post={post}/>
      {post.text && <div className='postContent v'>{post.text}</div>}
      {post.media[0] && <div className='postMedia v'>{handleMedia(post.media, 'post')}</div>}
      <PostInteract post={post} showReply={showReply} setShowReply={setShowReply}/>
      {showReply && renderReplies()}
      {showReply && <PostReply post={post}/>}
    </div>
  );
};

export default Post;

