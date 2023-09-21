import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';
import {firebase} from 'util';

import Post from './post/Post.jsx';
import SubmitPost from './SubmitPost.jsx';
import ImageUpload from './ImageUpload.jsx';

const Home = function() {
  const feed = st.community.feeds.home || [];

  var renderFeed = function() {
    if (!feed) {return};

    var rendered = [];

    for (var i = feed.length - 1; i >= 0; i--) {
      var post = feed[i];

      if (!post.parent) {
        rendered.push(<Post key={i} post={post}/>);
      } else {
        console.log(post);
      }
    }

    return rendered;
  };

  var handleMedia = function(media) {
    var rendered = [];

    media.map(function(entry, i) {
      if (entry.type === 'image') {
        rendered.push(<img key={i} className='postImage' src={entry.url}/>);
      } else {
        rendered.push(<video key={i} className='postVideo' src={entry.url}/>);
      }
    })

    return rendered;
  };

  return (
    <div className='home v'>
      <SubmitPost />
      <div className='posts'>
        {renderFeed()}
      </div>
    </div>
  );
};

export default Home;

