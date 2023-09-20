import React, {lazy, useEffect, useState} from 'react';
import {AiFillSave as Save, AiOutlineClose as Close} from 'react-icons/ai';
import st from 'ryscott-st';
import {ax, helpers, firebase} from 'util';

import SubmitPost from '../SubmitPost.jsx';
import ImageUpload from '../ImageUpload.jsx';
import Post from '../post/Post.jsx';
import PicUpload from './PicUpload.jsx';

const UserProfile = function() {
  const [posts, setPosts] = useState(st.user.posts);
  const [editBio, setEditBio] = useState(false);
  const settings = st.user.settings || {};

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

  var updateBio = function() {
    var headline = document.getElementById('editHeadline').value;
    var bio = document.getElementById('editBio').value;

    if (!bio || !headline) {
      helpers.alert('Please complete all fields.');
      return;
    }

    var newSettings = {...settings, headline: headline, bio: bio};

    st.setUser({...st.user, settings: newSettings});
    setEditBio(false);
    ax.updateSettings({uid: st.user.uid, settings: newSettings});
  };

  useEffect(()=>{setPosts(st.user.posts)}, [st.user]);

  return (
    <div className='profile v'>
      <div className='profileHead h'>
        <div className='profileLeft v'>
          <PicUpload settings={settings}/>
          <b>{st.user.username}</b>
        </div>
        {editBio &&
          <div className='h' style={{width: '100%', height: '100%'}}>
            <div className='bio'>
              <input id='editHeadline' className='editHeadline' defaultValue={settings.headline} placeholder='edit headline'/>
              <textarea id='editBio' className='editBio' defaultValue={settings.bio} placeholder='edit bio'/>
            </div>
            <div className='editButtons v'>
              <Close className='editButton grow' size={20} onClick={()=>{setEditBio(false)}}/>
              <Save  className='editButton grow' size={20} onClick={updateBio}/>
            </div>
          </div>
        }
        {!editBio &&
          <div className='bio' onClick={()=>{setEditBio(true)}}>
            <h4>{settings.headline ? settings.headline : 'add a headline'}</h4>
            {settings.bio ? settings.bio : 'add a bio'}
          </div>
        }
      </div>
      <SubmitPost />
      <div className='posts'>
        {renderFeed()}
      </div>
    </div>
  );
};

export default UserProfile;

