import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';
import {firebase} from 'util';

import SubmitPost from './SubmitPost.jsx';
import ImageUpload from './ImageUpload.jsx';

const Home = function() {
  const feed = st.community.feeds.home || [];

  var renderFeed = function() {
    if (!feed) {return};

    var rendered = [];

    for (var i = feed.length - 1; i >= 0; i--) {
      var post = feed[i];

      rendered.push(
        <div key={i} className='post v'>
          <div className='postHead h'>
            <div className='postUser'>{post.user.username}</div>
            <div className='postDate'><small>{new Date(post.createdOn).toLocaleString('en-GB', { timeZone: 'America/New_York' })}</small></div>
          </div>
          <div className='postContent v'>{post.text}</div>
          <div className='postMedia v'>
            {post.media[0] && handleMedia(post.media)}
          </div>
        </div>
      );
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

