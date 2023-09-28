import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';
import {firebase} from 'util';

import SubmitPost from './SubmitPost.jsx';
import Feed from './Feed.jsx';

const Grow = function() {
  const feed = st.community.feeds.grow || [];

  return (
    <div className='growFeed v'>
      grow
      <SubmitPost />
      <Feed feed={feed}/>
    </div>
  );
};

export default Grow;

