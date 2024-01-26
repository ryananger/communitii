import React, {useState} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax} from 'util';

const PostInteract = function({post, showReply, setShowReply}) {
  const [liked, setLiked] = useState(post.likes.includes(st.user.uid));

  var handleLike = function() {
    var updatedPost = post;

    if (liked) {
      updatedPost.likes.splice(updatedPost.likes.indexOf(st.user.uid), 1);

      setLiked(false);
    } else {
      updatedPost.likes.push(st.user.uid);

      setLiked(true);
    }

    ax.likePost(post);
  };

  return (
    <div className='postInteract h'>
      <div className='likeContainer h'>
        <icons.LikeIcon className={`likeButton grow ${liked ? 'liked' : ''}`} size={28} onClick={handleLike}/>
        <div className='likeCount'>{post.likes.length ? post.likes.length : ''}</div>
      </div>
      <div className='replyToggle h' onClick={()=>{setShowReply(!showReply)}}>
        <small>{post.replies && post.replies.length > 0 ? post.replies.length : ''}</small>
        <icons.CommentIcon className='commentButton grow' size={24}/>
      </div>
    </div>
  )
};

export default PostInteract;