import React, {useState} from 'react';
import {IoMdHeart as Like, IoMdChatbubbles as Comment} from 'react-icons/io';
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
      st.setFeed({...st.feed, post: updatedPost});
    } else {
      updatedPost.likes.push(st.user.uid);

      setLiked(true);
      st.setFeed({...st.feed, post: updatedPost});
    }

    ax.likePost(post);
  };

  return (
    <div className='replyInteract h'>
      <div className='likeContainer h'>
        <Like className={`likeButton grow ${liked ? 'liked' : ''}`} size={28} onClick={handleLike}/>
        <div className='likeCount'>{post.likes.length ? post.likes.length : ''}</div>
      </div>
      <Options post={post}/>
    </div>
  )
};

export default PostInteract;