import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';
import {firebase} from 'util';

import SubmitPost from './SubmitPost.jsx';
import Feed from './Feed.jsx';

const Work = function() {
  const feed = st.community.feeds.work || [];

  return (
    <div className='workFeed v'>
      work
      <SubmitPost />
      <Feed feed={feed}/>
    </div>
  );
};

export default Work;

