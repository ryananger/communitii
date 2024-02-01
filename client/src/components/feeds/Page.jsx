import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';

import SubmitPost from './SubmitPost.jsx';
import Feed from './Feed.jsx';

const Page = function({feed}) {
  return (
    <div className='page v'>
      <SubmitPost />
      <Feed feed={st.community.feeds[feed]}/>
    </div>
  );
};

export default Page;

