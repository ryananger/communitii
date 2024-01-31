import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';
import {helpers, firebase} from 'util';

import SubmitPost from './SubmitPost.jsx';
import FeedFilter from './FeedFilter.jsx';
import Feed from './Feed.jsx';

var allString = 'home learn grow work play help ';

const Home = function() {
  const feeds = st.community.feeds;
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
    st.setFeed(newFeed);
  };

  useEffect(handleFilter, [homeFilter]);

  return (
    <div className='page v'>
      <SubmitPost />
      <Feed filter={<FeedFilter />}/>
    </div>
  );
};

export default Home;

