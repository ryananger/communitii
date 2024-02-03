import React, {lazy, useEffect, useState} from 'react';
import icons from 'icons';

import st from 'ryscott-st';
import {helpers, firebase} from 'util';

const ImageUpload = function({uploads, setUploads}) {
  var renderUploads = function() {
    var rendered = [];

    uploads.map(function(entry){
      var removeUpload = function() {
        var newUploads = [];

        uploads.map(function(upload) {
          if (upload.src !== entry.src) {
            newUploads.push(upload);
          }
        })

        setUploads(newUploads);
      };

      rendered.push(
        <div key={entry.name} className='anchor h'>
          <icons.CloseIcon className='uploadRemove float' onClick={removeUpload}/>
          {entry.type === 'image' && <img className='uploadThumb' src={entry.src}/>}
          {entry.type === 'video' && <video className='uploadThumb' src={entry.src}/>}
        </div>);
    })

    return rendered;
  };

  var loadImage = function(event) {
    var input = document.getElementById('imageInput');
    var newUploads = [...uploads];

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
    <div className={`imageUpload h`} style={uploads[0] ? {display: 'block'} : {display: 'none'}}>
      <div className='uploads h'>
        {renderUploads()}
      </div>
      <input type="file" id="imageInput" accept=".jpg, .png, .gif, .mp4, .mov" style={{display: 'none'}} onChange={loadImage} multiple/>
    </div>
  );
};

export default ImageUpload;

