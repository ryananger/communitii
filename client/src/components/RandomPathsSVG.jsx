import React from 'react';

const width = window.innerWidth;
const height = window.innerHeight;

// between 50% and 65%
const leftY1 = (height * 0.5) + Math.random() * (height * 0.15);
const rightY1 = leftY1 + (Math.random() * height * 0.15) + (height * 0.15);

const leftY2 = leftY1 - (height * 0.1) - Math.random() * (height * 0.1);
const rightY2 = leftY2 - (Math.random() * height * 0.1) - (height * 0.1);

function RandomPathsSVG({color}) {
  const fill = ['find', 'profile', 'userProfile', 'login'].includes(color) ? 'home' : color;

  // SVG path string
  const svgPath1 = `M 0 ${leftY1} L ${width} ${rightY1} L ${width} ${height} L 0 ${height} Z`;
  const svgPath2 = `M 0 ${leftY2} L ${width} ${rightY2} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg className="randomPaths" xmlns="http://www.w3.org/2000/svg" style={{position: 'fixed'}}>
      <path d={svgPath1} fill={`var(--${fill})`} fillOpacity="0.2"/>
      <path d={svgPath2} fill={`var(--${fill})`} fillOpacity="0.1"/>
    </svg>
  );
}

export default RandomPathsSVG;