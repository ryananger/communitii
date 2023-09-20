import React, {lazy, useEffect, useState} from 'react';
import {MdAddToPhotos as Add} from 'react-icons/md';

import st from 'ryscott-st';
import {helpers, firebase} from 'util';

const ReplyUpload = function({uploads, setUploads, className, reply}) {
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

  var loadImage = function() {
    var input = document.getElementById('replyImageInput');
    var newUploads = [];

    if (input.files && input.files[0]) {
      var load = function(index) {
        var file = input.files[index];
        var reader = new FileReader();
        var type;

        switch (file.type) {
          case 'image/png':
          case 'image/jpeg':
          case 'image/gif':
            type = 'image';
            break;
          case 'video/mp4':
          case 'video/quicktime':
            type = 'video';
            break;
        }

        reader.readAsDataURL(file);
        reader.onload = function () {
          newUploads.push({file: file, name: file.name, src: reader.result, type});

          if (index < input.files.length - 1) {
            load(index + 1);
          } else {
            setUploads(newUploads);
          }
        };
      };

      load(0);
    }
  };

  return (
    <div className='replyUpload'>
      <div className='uploads h'>
        {renderUploads()}
      </div>
      <input type="file" id="replyImageInput" accept=".jpg, .png, .gif, .mp4, .mov" style={{display: 'none'}} onChange={loadImage} multiple/>
    </div>
  );
};

export default ReplyUpload;

