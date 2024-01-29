import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';

import Post from './post/Post.jsx';

const PostView = function({post}) {
  useEffect(()=>{}, [st.community]);

  return (
    <div className='postView' style={{width: '90%'}}>
      <Post post={post}/>
    </div>
  );
};

export default PostView;