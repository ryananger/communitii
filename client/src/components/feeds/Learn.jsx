import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';
import {firebase} from 'util';

import SubmitPost from './SubmitPost.jsx';
import Feed from './Feed.jsx';

const Learn = function() {
  const feed = st.community.feeds.learn || [];

  return (
    <div className='learnFeed v'>
      learn
      <SubmitPost />
      <Feed feed={feed}/>
    </div>
  );
};

export default Learn;

