import React, {lazy, useEffect, useState} from 'react';
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
          feed: st.view,
          text,
          media,
          date: Date(Date.now()).toString(),
          likes: [],
          replies: []
        };

        var newFeed = st.community.feeds[st.view];
        newFeed.push(post);

        el.value = null;
        st.setCommunity({...st.community, feeds: {...st.community.feeds, [st.view]: newFeed}});

        ax.submitPost(post);
        setUploads([]);
      })
  };

  return (
    <div className='postContainer v'>
      <textarea id='submitText' placeholder='Say something!'/>

      <ImageUpload uploads={uploads} setUploads={setUploads}/>
      <div className='postButtons h' onClick={handleSubmit}>submit</div>
    </div>
  );
};

export default SubmitPost;

