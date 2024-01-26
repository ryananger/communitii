import React, {lazy, useEffect, useState} from 'react';
import icons from 'icons';

import st from 'ryscott-st';
import {ax, helpers, firebase} from 'util';

const PicUpload = function({settings}) {
  var renderUploads = function() {
    var rendered = [];

    uploads.map(function(entry){
      if (entry.type === 'image') {
        rendered.push(<img className='uploadThumb' src={entry.src} key={entry.name}/>);
      } else {
        rendered.push(<video className='uploadThumb' src={entry.src} key={entry.name}/>);
      }
    })

    return rendered;
  };

  var loadImage = function(event) {
    var input = document.getElementById('picInput');

    if (input.files && input.files[0]) {
      var file = input.files[0];

      var setPfp = function(url) {
        var newSettings = {...settings, pfp: url};

        st.setUser({...st.user, settings: newSettings});
        ax.updateSettings({uid: st.user.uid, settings: newSettings});
      };

      var upload = function(file) {
        firebase.uploadBlob(file, 'pfp' + st.user.uid, setPfp);
      };

      helpers.resizeImage(file, 200, upload);
    }
  };

  var handlePic = function() {
    if (settings.pfp) {
      return <img className='pfpImg' src={settings.pfp} style={{height: '100px'}}/>;
    } else {
      return <icons.ProfileIcon size={80} style={{color: 'var(--borderColor)'}}/>;
    }
  };

  return (
    <div className='picUpload v'>
      <div className='pfp v c' onClick={()=>{document.getElementById('picInput').click()}}>
        {handlePic()}
      </div>
      <input type="file" id="picInput" accept=".jpg, .png" style={{display: 'none'}} onChange={loadImage}/>
    </div>
  );
};

export default PicUpload;

