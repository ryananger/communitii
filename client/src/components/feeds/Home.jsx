import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';

var fakeFeed = [
  {
    user: 'Geoff',
    text: 'lol',
    media: null,
    date: '2023-08-15 04:09'
  },
  {
    user: 'Jeff C.',
    text: 'busy training',
    media: 'mortalkombat.jpg',
    date: '2023-08-15 04:04'
  },
  {
    user: 'Jeff B.',
    text: 'I am Jeff B. King of all Jeffs, having killed Jeff A. in sanctioned combat.',
    media: null,
    date: '2023-08-15 04:02'
  }
];

const Home = function() {
  const [feed, setFeed] = useState([]);

  var renderFeed = function() {
    var rendered = [];

    feed.map(function(post, i) {
      rendered.push(
        <div key={i} className='post v'>
          <div className='postHead h'>
            <div className='postUser'>{post.user}</div>
            <div className='postDate'><small>{post.date}</small></div>
          </div>
          <div className='postContent v'>{post.text}</div>
        </div>
      );
    });

    return rendered;
  };

  useEffect(()=>{
    if (st.community) {
      setFeed(st.community.feeds.home);
    }
  }, [st.community]);

  return (
    <div className='home v'>
      <div className='postContainer v'>
        <textarea placeholder='Say something!'/>
        <div className='postButtons h'>submit</div>
      </div>
      <div className='posts'>
        {renderFeed()}
      </div>
    </div>
  );
};

export default Home;

