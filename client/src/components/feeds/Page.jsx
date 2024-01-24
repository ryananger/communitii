import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';
import {firebase} from 'util';

import SubmitPost from './SubmitPost.jsx';
import ActionBox from './ActionBox.jsx';
import Feed from './Feed.jsx';

const Page = function({feed}) {
  const posts = st.community.feeds[feed] || [];

  return (
    <div className='page v'>
      <SubmitPost />
      <Feed feed={posts}/>
    </div>
  );
};

export default Page;

