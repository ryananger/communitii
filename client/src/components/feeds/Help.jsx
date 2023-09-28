import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';
import {firebase} from 'util';

import SubmitPost from './SubmitPost.jsx';
import Feed from './Feed.jsx';

const Help = function() {
  const feed = st.community.feeds.help || [];

  return (
    <div className='helpFeed v'>
      help
      <SubmitPost />
      <Feed feed={feed}/>
    </div>
  );
};

export default Help;

