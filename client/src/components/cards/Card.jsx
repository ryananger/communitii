import React, {lazy, useEffect, useState, useRef} from 'react';
import icons from 'icons';

const Card = function({type, content}) {
  const element = useRef(null);

  var openStyle = "flex: 1 1 auto;";
  var closedStyle = "height: calc(28px); flex: 0 0 auto;";

  var handleOpen = function() {
    if (element.current.style.flex === '1 1 auto') {
      element.current.style = closedStyle;
    } else if (element.current.style.flex === '0 0 auto') {
      element.current.style = openStyle;
    }
  };

  useEffect(()=>{
    element.current.style = openStyle;
  }, [element]);

  return (
    <div id={`${type}Card`} ref={element} className={`${type} card v`}>
      <div className={`cardHead ${type}Head h`}>
        {type}
        <icons.MinIcon style={{height: '100%'}} onClick={handleOpen}/>
      </div>
      {content}
    </div>
  );
};

export default Card;

