import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';
import icons from 'icons';
import {ax, helpers} from 'util';

const ActionBox = function() {
  return (
    <div className='actionBox card h'>
      <div style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '5px', backgroundColor: `var(--${st.color})`}}/>
      <icons.EventsIcon className='actionBoxIcon grow'/>
      <icons.LibraryIcon className='actionBoxIcon grow'/>
      <icons.ShopIcon className='actionBoxIcon grow'/>
      <icons.MoneyIcon className='actionBoxIcon grow'/>
      <icons.InfoIcon className='actionBoxIcon grow'/>
    </div>
  )
};

export default ActionBox;

