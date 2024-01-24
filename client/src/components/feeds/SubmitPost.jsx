import React, {lazy, useEffect, useState} from 'react';
import {IoMdSend as Send} from 'react-icons/io';
import st from 'ryscott-st';
import {ax, helpers, firebase} from 'util';

import ImageUpload from './ImageUpload.jsx';

const SubmitPost = function() {
  const [uploads, setUploads] = useState([]);

  var handleSubmit = async function() {
    var el = document.getElementById('submitText');
    var text = el.value;

    if (uploads.length === 0 && !text) {return};

    var promises = [];
    var media = [];
    var uid = st.user.uid;

    var postFeed = st.view === 'userProfile' ? 'home' : st.view;

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
        var post = {
          user: st.user,
          community: st.user.community,
          feed: postFeed,
          text,
          media,
          date: Date(Date.now()).toString(),
          likes: [],
          replies: []
        };

        var newFeed = st.community.feeds[postFeed];
        newFeed.push(post);

        el.value = null;
        st.setCommunity({...st.community, feeds: {...st.community.feeds, [postFeed]: newFeed}});

        ax.submitPost(post);

        var newPosts = [...st.user.posts, post];
        st.setUser({...st.user, posts: newPosts});

        setUploads([]);
      })
  };

  return (
    <div className='postContainer v'>
      <textarea id='submitText' placeholder='Say something!'/>
      <div className='submitButtons h'>
        <ImageUpload uploads={uploads} setUploads={setUploads}/>
        <Send className='postButton grow' size={30} onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default SubmitPost;

