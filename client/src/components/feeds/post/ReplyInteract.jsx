import React, {useState} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax} from 'util';

import Options from '../Options.jsx';

const PostInteract = function({post}) {
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
    <div className='replyInteract h'>
      <div className='likeContainer h'>
        <icons.LikeIcon className={`likeButton grow ${liked ? 'liked' : ''}`} size={22} onClick={handleLike}/>
        <div className='likeCount'>{post.likes.length ? post.likes.length : ''}</div>
      </div>
      {post.user.uid === st.user.uid && <Options post={post}/>}
    </div>
  )
};

export default PostInteract;