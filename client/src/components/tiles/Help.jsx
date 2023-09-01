import React, {lazy, useEffect, useState} from 'react';

import 'styles';
import Slide from '../Slide.jsx';

const Help = function(slide) {
  return (
    <Slide dir={'right'} time={4} delay={3}>
      <div className='v' style={{height: '80%'}}>
        <h2>I can probably help.</h2>
      </div>
    </Slide>
  );
};

export default Help;

