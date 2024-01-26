import React, {lazy, useEffect, useState} from 'react';
import {MdMinimize as Min} from "react-icons/md";

const Card = function({type, content}) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`${type} card v`} style={open ? openStyle : closedStyle}>
      <div className={`cardHead ${type}Head h`}>
        {type}
        <Min onClick={()=>{setOpen(!open)}}/>
      </div>
      {content}
    </div>
  );
};

var openStyle = {flex: 'auto'};
var closedStyle = {height: 'calc(28px)', flex: 'none'};

export default Card;

