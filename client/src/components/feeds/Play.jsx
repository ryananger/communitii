import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';
import {firebase} from 'util';

import SubmitPost from './SubmitPost.jsx';
import Feed from './Feed.jsx';

const Play = function() {
  const feed = st.community.feeds.play || [];

  return (
    <div className='playFeed v'>
      play
      <SubmitPost />
      <Feed feed={feed}/>
    </div>
  );
};

export default Play;

