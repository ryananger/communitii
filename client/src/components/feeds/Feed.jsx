import React, {lazy, useEffect, useState} from 'react';

import Post from './post/Post.jsx';

const Feed = function({feed}) {
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
      {renderFeed()}
    </div>
  );
};

export default Feed;

