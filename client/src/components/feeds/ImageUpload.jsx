import React, {lazy, useEffect, useState} from 'react';
import {MdAddToPhotos as Add} from 'react-icons/md';

import st from 'ryscott-st';
import {helpers, firebase} from 'util';

const ImageUpload = function({uploads, setUploads}) {
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
    var input = document.getElementById('imageInput');
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
    <div className={`imageUpload v`}>
      <div className='uploads h'>
        {renderUploads()}
      </div>
      <div id="uploadButton" className='grow' onClick={()=>{document.getElementById('imageInput').click()}}><Add size={32}/></div>
      <input type="file" id="imageInput" accept=".jpg, .png, .gif, .mp4, .mov" style={{display: 'none'}} onChange={loadImage} multiple/>
    </div>
  );
};

export default ImageUpload;

