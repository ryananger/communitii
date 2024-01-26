import React, {useEffect, useState} from 'react';
import icons from 'icons';

import st            from 'ryscott-st';
import {ax, helpers} from 'util';

const Admin = function({open, setOpen}) {
  if (!open) {return};

  return (
    <div className='admin v'>
      <div className='adminPanel v'>
        <icons.CloseIcon className='adminClose' size={32} onClick={()=>{setOpen(false)}}/>
      </div>
    </div>
  )
};

export default Admin;

