import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';
import {helpers, firebase} from 'util';

import SubmitPost from './SubmitPost.jsx';
import Feed from './Feed.jsx';

var allString = 'home learn grow work play help ';

const Home = function() {
  const feeds = st.community.feeds;
  const [feed, setFeed] = useState([]);
  const [homeFilter, setHomeFilter] = st.newState('homeFilter', useState(st.homeFilter || allString));

  var handleFilter = function() {
    var newFeed = [];

    var filterFeed = function(val) {
      if (!val) return;

      if (homeFilter.includes(val)) {
        newFeed = [...newFeed, ...feeds[val]];
      }
    };

    var split = homeFilter.split(' ');

    for (var i = 0; i < split.length; i++) {
      filterFeed(split[i]);
    }

    helpers.sortFeed(newFeed);
    setFeed(newFeed);
  };

  useEffect(handleFilter, [homeFilter]);
  useEffect(()=>{}, [feed]);

  return (
    <div className='page v'>
      <SubmitPost />
      <Feed feed={feed}/>
    </div>
  );
};

export default Home;

