import React, {lazy, useEffect, useState} from 'react';

import 'styles';

const Below = function() {
  const start = {
    position: 'absolute',
    top: '95vh',
    opacity: 1,
    visibility: 'hidden',
    transition: 'top 1s, opacity 3s'
  };

  const [style, setStyle] = useState(start);

  useEffect(()=>{
    setTimeout(()=>{
      setStyle({...style, top: '85vh', visibility: 'visible'});
    }, 8000);

    setTimeout(()=>{
      setStyle({...style, top: '85vh', visibility: 'visible', opacity: 0});
    }, 10000);
  }, []);

  return <div style={style}>see below</div>;
};

export default Below;

