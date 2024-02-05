import React, {lazy, useEffect, useState, useRef} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, helpers, firebase} from 'util';

import ImageUpload from './ImageUpload.jsx';

const SubmitPost = function() {
  const [uploads, setUploads] = useState([]);
  const el = useRef(null);

  const postFeed = st.view === 'userProfile' ? 'home' : st.view;
  const uid = st.user.uid;

  var submitPost = function(post) {
    var newFeed, newFeeds, newPosts, newCommunity;
    var localPost = {...post, user: st.user};

    newFeed = st.community.feeds[postFeed];
    newFeed.push(localPost);
    newFeeds = {...st.community.feeds, [postFeed]: newFeed};
    newPosts = [...st.user.posts, localPost];

    newCommunity = {...st.community, feeds: newFeeds};
    newCommunity = ax.transformFeeds(newCommunity);

    st.setCommunity(newCommunity);
    st.setUser({...st.user, posts: newPosts});

    ax.submitPost(post);
  };

  var handleSubmit = async function() {
    var text = el.current.value;

    if (uploads.length === 0 && !text) {return};

    var post = {
      user: {uid: uid},
      community: st.user.community,
      feed: postFeed,
      media: [],
      text,
      createdOn: new Date().toISOString(),
      likes: [],
      replies: []
    };

    if (uploads.length === 0) {
      submitPost(post);

      el.current.value = null;
      return;
    }

    var cb = function() {
      submitPost(post);
      setUploads([]);
      el.current.value = null;
    };

    helpers.loadMedia(uploads, post.media, cb);
  };

  return (
    <div className='postContainer v'>
      <textarea id='submitText' ref={el} placeholder='Say something!'/>
      <div className='submitButtons h'>
        <ImageUpload uploads={uploads} setUploads={setUploads} id='post'/>
        <div id="uploadButton" className='grow' onClick={()=>{document.getElementById('postImageInput').click()}}>
          <icons.AddPhotosIcon size={32}/>
        </div>
        <icons.SendIcon className='postButton grow' size={30} onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default SubmitPost;

