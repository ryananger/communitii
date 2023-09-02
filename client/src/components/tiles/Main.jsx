import React, {lazy, useEffect, useState} from 'react';

import 'styles';
import Slide from '../Slide.jsx';
import SmoothImage from '../SmoothImage.jsx';

const Main = function() {
  const [vis, setVis] = useState('hidden');

  const projects = [
    {
      src: 'toast',
      link: 'https://ryananger.github.io/toast',
      description: 'a sleek and modern restaurant presentation with menu and reservations'
    },
    {
      src: 'jupiterFalls',
      link: 'https://jupiterfalls.earthpunk.art',
      description: 'an educational math game built for web and mobile platforms, includes chickens and robots'
    },
    {
      src: 'inkgen',
      link: 'https://gen.inkvessels.art',
      description: 'an app that generates a random mandala based on an input image, great for artists'
    },
    // {
    //   src: 'thinkFood',
    //   link: 'https://thinkfood.xyz',
    //   description: 'a user database and appointment scheduling system for food drive organizations'
    // }
  ];

  var renderProjects = function() {
    var rendered = [];

    projects.map(function(entry) {
      rendered.push(
        <div className='projectCard v' key={entry.src} onClick={()=>{window.open(entry.link, '_blank')}}>
          <SmoothImage className='projectImage' src={`public/images/${entry.src}.png`}/>
          <div className='projectInfo v'>
            <h2 style={{margin: '12px'}}>{entry.src}</h2>

            {entry.description}
            <br/>
          </div>
        </div>
      )
    })

    return rendered;
  };

  useEffect(()=>{
    setTimeout(()=>{
      setVis('visible');
    }, 6000)
  }, [])

  return (
    <div className={`main v ${vis}`}>
      <div style={{textAlign: 'center', padding: '12px'}}>
        <h3>take a look at some of my recent projects and reach out for more info!</h3>
      </div>
      <div className='projects h'>
        {renderProjects()}
      </div>
    </div>
  );
};

export default Main;

