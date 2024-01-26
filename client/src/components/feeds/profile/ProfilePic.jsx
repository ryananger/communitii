import React, {lazy, useEffect, useState} from 'react';
import icons from 'icons';

import st from 'ryscott-st';
import {ax, helpers, firebase} from 'util';

const ProfilePic = function({url, isStatic}) {
  var handlePic = function() {
    if (url) {
      return <img className='pfpImg' src={url} style={{height: '100px'}}/>;
    } else {
      return <icons.ProfileIcon size={80} style={{color: 'var(--borderColor)'}}/>;
    }
  };

  var handleClick = function() {
    if (isStatic) {
      return;
    }

    document.getElementById('picInput').click();
  };

  return (
    <div className='pfp v c' onClick={handleClick}>
      {handlePic()}
    </div>
  );
};

export default ProfilePic;

