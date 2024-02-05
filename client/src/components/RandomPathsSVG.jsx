import React from 'react';
import {helpers} from 'util';

const width = window.innerWidth;
const height = window.innerHeight;

const leftY1 = (height * 0.5) +  helpers.rand(height * 0.15);
const leftY2 = leftY1 - (height * 0.1) -  helpers.rand(height * 0.1);
const rightY1 = leftY1 + helpers.rand(height * 0.15) + (height * 0.15);
const rightY2 = leftY2 - helpers.rand(height * 0.1) - (height * 0.1);

function RandomPathsSVG({color}) {
  const fill = ['find', 'profile', 'userProfile', 'login'].includes(color) ? 'home' : color;

  // SVG path string
  const svgPath1 = `M 0 ${leftY1} L ${width} ${rightY1} L ${width} ${height} L 0 ${height} Z`;
  const svgPath2 = `M 0 ${leftY2} L ${width} ${rightY2} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg className="randomPaths" xmlns="http://www.w3.org/2000/svg" style={{position: 'fixed'}}>
      <path d={svgPath1} fill={`var(--${fill})`} style={{transition: 'fill 1s'}} fillOpacity="0.25"/>
      <path d={svgPath2} fill={`var(--${fill})`} style={{transition: 'fill 1s'}} fillOpacity="0.15"/>
    </svg>
  );
}

export default RandomPathsSVG;