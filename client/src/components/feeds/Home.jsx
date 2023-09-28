import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';
import {firebase} from 'util';

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

  return (
    <div className='homeFeed v'>
      <SubmitPost />
      <Feed feed={feed}/>
    </div>
  );
};

export default Home;

