import React, {lazy, useEffect, useState} from 'react';
import {AiFillSave as Save, AiOutlineClose as Close} from 'react-icons/ai';
import st from 'ryscott-st';
import {ax, helpers, firebase} from 'util';

import Post from '../post/Post.jsx';
import ProfileCard from './ProfileCard.jsx';

const Profile = function({profile}) {
  const posts = profile.posts;
  const settings = profile.settings || {};

  var renderFeed = function() {
    if (!posts[0]) {return};

    var rendered = [];

    for (var i = posts.length - 1; i >= 0; i--) {
      var post = posts[i];

      if (!post.parent) {
        rendered.push(<Post key={i} post={post}/>);
      }
    }

    return rendered;
  };

  useEffect(()=>{
    ax.getPostsForUser(profile);
  }, []);

  return (
    <div className='profile v'>
      <ProfileCard user={profile} onProfile={true}/>
      <div className='posts'>
        {renderFeed()}
      </div>
    </div>
  );
};

export default Profile;
