import React, {lazy, useEffect, useState} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, helpers, firebase} from 'util';

import ImageUpload from './ImageUpload.jsx';

const SubmitPost = function() {
  const [uploads, setUploads] = useState([]);
  const postFeed = st.view === 'userProfile' ? 'home' : st.view;

  var submitPost = function(post) {
    var newFeed, newFeeds, newPosts;

    newFeed = st.community.feeds[postFeed];
    newFeed.push(post);
    newFeeds = {...st.community.feeds, [postFeed]: newFeed};
    newPosts = [...st.user.posts, post];

    st.setCommunity({...st.community, feeds: newFeeds});
    st.setUser({...st.user, posts: newPosts});

    ax.submitPost(post);
  };

  var handleSubmit = async function() {
    var el = document.getElementById('submitText');
    var text = el.value;

    if (uploads.length === 0 && !text) {return};

    var media = [];
    var uid = st.user.uid;

    var post = {
      user: st.user,
      community: st.user.community,
      feed: postFeed,
      text,
      media,
      createdOn: new Date().toISOString(),
      likes: [],
      replies: []
    };

    if (uploads.length === 0) {
      submitPost(post);

      el.value = null;
      return;
    }

    var promises = [];

    uploads.map(function(entry) {
      var split = entry.file.name.split('.');
      var path = split[0] + Date.now() + uid + '.' + split[1];

      var promise = new Promise(function(resolve) {
        var push = function(url) {
          media.push({type: entry.type, url});
          resolve(url);
        };

        var upload = function(file) {
          firebase.uploadBlob(file, path, push);
        };

        if (entry.type === 'image') {
          helpers.resizeImage(entry.file, 800, upload);
        } else {
          upload(entry.file);
        }
      });

      promises.push(promise);
    });

    Promise.all(promises)
      .then(function(res) {
        submitPost(post);

        el.value = null;
        setUploads([]);
      })
  };

  return (
    <div className='postContainer v'>
      <textarea id='submitText' placeholder='Say something!'/>
      <div className='submitButtons h'>
        <ImageUpload uploads={uploads} setUploads={setUploads}/>
        <icons.SendIcon className='postButton grow' size={30} onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default SubmitPost;

