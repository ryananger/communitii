import React, {useState} from 'react';
import {IoMdSend as Send} from 'react-icons/io';
import {MdAddToPhotos as Add} from 'react-icons/md';
import st from 'ryscott-st';
import {ax, firebase} from 'util';

import ReplyUpload from './ReplyUpload.jsx';

const PostReply = function({post}) {
  const [uploads, setUploads] = useState([]);
  const _id = post._id;

  var handleSubmit = function() {
    var text = document.getElementById(`replyText${_id}`).value;

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
        var post = {
          user: st.user.uid,
          feed: st.feed.name,
          text,
          media,
          date: Date(Date.now()).toString(),
          likes: [],
          parent: _id
        };

        text = null;
        ax.submitPost(post);
        setUploads([]);
      })
  };

  return (
    <div className='replyContainer v'>
      <textarea id={`replyText${post._id}`} className='replyText' placeholder='post a comment'/>
      <ReplyUpload uploads={uploads} setUploads={setUploads}/>
      <div className='replyButtons'>
        <Add className='replyButton grow' onClick={()=>{document.getElementById('replyImageInput').click()}} size={20}/>
        <Send className='replyButton grow' onClick={handleSubmit} size={20}/>
      </div>
    </div>
  )
};

export default PostReply;