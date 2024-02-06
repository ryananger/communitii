import React, {useState, useEffect} from 'react';
import icons from 'icons';
import st from 'ryscott-st';
import {ax, mouse, helpers} from 'util';

const Options = function({className, entry, type}) {
  const [showOptions, setShowOptions] = useState(false);
  const [pos, setPos] = useState(null);

  var handleDelete = function() {
    var send = {
      _id: entry._id,
      parent: entry.parent,
      uid: entry.user.uid,
      replies: entry.replies
    };

    if (type === 'post') {
      ax.deletePost(send);
    } else if (type === 'message') {
      var userSent = entry.user._id === st.user._id;
      var commMsg  = st.chatWith === 'community';

      ax.deleteMessage(entry, userSent, commMsg);
    }
  };

  useEffect(()=>{
    setPos({x: mouse.x, y: mouse.y});
  }, [showOptions]);

  useEffect(()=>{
    var el = document.getElementById(`options_${entry._id}`);

    window.addEventListener('click', function(e){
      if (!el.contains(e.target)) {
        setShowOptions(false);
        setPos(null);
      }
    })
  }, []);

  return (
    <div id={`options_${entry._id}`} className={'optionsContainer v c ' + className}>
      <icons.OptionsIcon className='grow' onClick={()=>{setShowOptions(!showOptions)}} size={16}/>
      {showOptions && pos && (
        <div className='optionsList v' style={{top: pos.y - 20, left: pos.x + 10}}>
          {(type === 'message' || entry.user.uid === st.user.uid) && <div className='grow' onClick={handleDelete}>delete</div>}
        </div>
      )}
    </div>
  )
};

export default Options;