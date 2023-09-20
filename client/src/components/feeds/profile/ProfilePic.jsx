import React, {lazy, useEffect, useState} from 'react';
import {BsPersonCircle as DefaultPic} from 'react-icons/bs';
import {MdAddToPhotos as Add} from 'react-icons/md';

import st from 'ryscott-st';
import {ax, helpers, firebase} from 'util';

const ProfilePic = function({url, isStatic}) {
  var handlePic = function() {
    if (url) {
      return <img className='pfpImg' src={url} style={{height: '100px'}}/>;
    } else {
      return <DefaultPic size={80} style={{color: 'var(--borderColor)'}}/>;
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

