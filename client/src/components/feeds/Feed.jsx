import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';
import {firebase} from 'util';

import SubmitPost from './SubmitPost.jsx';
import ImageUpload from './ImageUpload.jsx';
import Post from './post/Post.jsx';

const Feed = function({feed}) {
  var renderFeed = function() {
    if (!feed.posts[0]) {return};

    var rendered = [];

    for (var i = feed.posts.length - 1; i >= 0; i--) {
      var post = feed.posts[i];

      if (!post.parent) {
        rendered.push(<Post key={i} post={post}/>);
      }
    }

    return rendered;
  };

  if (!feed) {
    return;
  }

  return (
    <div className='home v'>
      <SubmitPost />
      <div className='posts'>
        {feed.posts && renderFeed()}
      </div>
    </div>
  );
};

export default Feed;

