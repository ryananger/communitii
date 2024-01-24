import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';
import {firebase} from 'util';

import ActionBox from './ActionBox.jsx';
import SubmitPost from './SubmitPost.jsx';
import Feed from './Feed.jsx';

const Home = function() {
  const feeds = st.community.feeds;
  const feed = [
    ...feeds.home,
    ...feeds.learn,
    ...feeds.grow,
    ...feeds.work,
    ...feeds.play,
    ...feeds.help
  ];

  console.log(feed);

  feed.sort(function(a, b) {
    var keyA = new Date(a.createdOn),
        keyB = new Date(b.createdOn);

    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;

    return 0;
  });

  return (
    <div className='page v'>
      <SubmitPost />
      <Feed feed={feed}/>
    </div>
  );
};

export default Home;

