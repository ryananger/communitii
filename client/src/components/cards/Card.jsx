import React, {lazy, useEffect, useState} from 'react';
import icons from 'icons';

const Card = function({type, content}) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`${type} card v`} style={open ? openStyle : closedStyle}>
      <div className={`cardHead ${type}Head h`}>
        {type}
        <icons.MinIcon onClick={()=>{setOpen(!open)}}/>
      </div>
      {content}
    </div>
  );
};

var openStyle = {flex: 'auto'};
var closedStyle = {height: 'calc(28px)', flex: 'none'};

export default Card;

