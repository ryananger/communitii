import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';

import Post from './post/Post.jsx';
import FeedFilter from './FeedFilter.jsx';

const Feed = function({feed, filter}) {
  var renderFeed = function() {
    var rendered = [];

    for (var i = feed.length - 1; i >= 0; i--) {
      var post = feed[i];

      if (!post.parent) {
        rendered.push(<Post key={i} post={post}/>);
      }
    }

    return rendered;
  };

  return (
    <div className='posts'>
      {filter}
      {renderFeed()}
    </div>
  );
};

export default Feed;

