import React, {useState} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, firebase} from 'util';

import ImageUpload from '../ImageUpload.jsx';

const PostReply = function({post}) {
  const [uploads, setUploads] = useState([]);

  var handleSubmit = function() {
    var el = document.getElementById(`replyText${post._id}`);
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

        firebase.uploadBlob(entry.file, path, push);
      });

      promises.push(promise);
    });

    Promise.all(promises)
      .then(function(res) {
        var submission = {
          user: {uid: uid},
          community: st.user.community,
          feed: post.feed,
          text,
          media,
          createdOn: Date(Date.now()).toString(),
          likes: [],
          parent: post._id
        };

        if (post.user.community === st.community) {
          var newFeed = st.community.feeds[post.feed];
          newFeed.push({...submission, user: st.user});

          var newCommunity = {
            ...st.community,
            feeds: {
              ...st.community.feeds,
              [post.feed]: newFeed}
          };

          newCommunity = ax.transformFeeds(newCommunity);
          st.setCommunity(newCommunity);
        }

        if (st.view === 'postView') {
          st.setPost({...st.post, replies: [...st.post.replies, {...submission, user: st.user}]});
        }

        el.value = null;
        ax.submitPost(submission);
        setUploads([]);
      })
  };

  return (
    <div className='replyContainer v'>
      <textarea id={`replyText${post._id}`} className='replyText' placeholder='post a comment'/>
      <ImageUpload uploads={uploads} setUploads={setUploads} id='reply'/>
      <div className='replyButtons'>
        <icons.AddPhotosIcon className='replyButton grow' onClick={()=>{document.getElementById('replyImageInput').click()}} size={20}/>
        <icons.SendIcon className='replyButton grow' onClick={handleSubmit} size={20}/>
      </div>
    </div>
  )
};

export default PostReply;