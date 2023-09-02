import React, {lazy, useEffect, useState} from 'react';
import {BsChevronCompactDown as Down} from 'react-icons/bs';

import 'styles';
import Slide from '../Slide.jsx';

const Help = function() {
  const [style, setStyle] = useState(start);
  const [vis, setVis] = useState('visible');

  const body = document.getElementById('body');

  var handleScroll = function() {
    var help = document.getElementById('help');

    if (body.scrollTop >= help.getBoundingClientRect().top) {
      setVis('hidden');
    } else {
      setVis('visible');
    }
  };

  var handleClick = function() {
    document.getElementById('main').scrollIntoView({behavior: 'smooth'});
    setVis('hidden');
  };

  useEffect(()=>{
    body.addEventListener('scroll', handleScroll, {passive: true});

    setTimeout(()=>{
      setStyle({...style, opacity: 1, visibility: 'visible'});
    }, 5000);
  }, []);

  return (
    <div id='help' className='v' style={style}>
      <h2>I can probably help.</h2>
      <Down className={`${vis} downButton beat`} size={72} onClick={handleClick}/>
    </div>
  );
};

const start = {
  height: '90%',
  justifyContent: 'space-between',
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 2s'
};

export default Help;