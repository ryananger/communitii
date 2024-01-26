import React, {useState, useEffect} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

const Options = function({post}) {
  const [showOptions, setShowOptions] = useState(false);

  var handleDelete = function() {
    var send = {
      _id: post._id,
      parent: post.parent,
      uid: post.user.uid,
      replies: post.replies
    };

    ax.deletePost(send);
  };

  return (
    <div className='optionsContainer v c' style={{width: '24px', height: '24px'}}>
      <icons.OptionsIcon className='grow' onClick={()=>{setShowOptions(!showOptions)}} size={16}/>
      {showOptions && (
        <div className='optionsList v'>
          {post.user.uid === st.user.uid  && <div className='grow' onClick={handleDelete}>delete</div>}
        </div>
      )}
    </div>
  )
};

export default Options;