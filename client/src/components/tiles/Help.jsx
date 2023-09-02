import React, {lazy, useEffect, useState} from 'react';
import {BsChevronCompactDown as Down} from 'react-icons/bs';

import 'styles';
import Slide from '../Slide.jsx';

const Help = function() {
  const [style, setStyle] = useState(start);
  const [vis, setVis] = useState('visible');

  const body = document.getElementById('body');

  var handleScroll = function(e) {
    var help = document.getElementById('help');

    if (body.scrollTop >= help.getBoundingClientRect().top) {
      setVis('hidden');
    } else {
      setVis('visible');
    }
  };

  useEffect(()=>{
    setTimeout(()=>{
      setStyle({...style, opacity: 1, visibility: 'visible'});
    }, 5000);
  }, []);

  useEffect(()=>{
    body.addEventListener('scroll', handleScroll, {passive: true});
  }, []);

  return (
    <div id='help' className='v' style={style}>
      <h2>I can probably help.</h2>
      <Down className={`${vis} beat`} style={{transition: 'opacity 1s'}} size={72}/>
    </div>
  );
};

const start = {
  height: '100%',
  justifyContent: 'space-between',
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 3s'
};

export default Help;