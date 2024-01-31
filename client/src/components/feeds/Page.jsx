import React, {lazy, useEffect, useState} from 'react';

import SubmitPost from './SubmitPost.jsx';
import Feed from './Feed.jsx';

const Page = function() {
  return (
    <div className='page v'>
      <SubmitPost />
      <Feed />
    </div>
  );
};

export default Page;

