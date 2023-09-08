import React, {useEffect, useState} from 'react';
import {IoMdClose as Close} from 'react-icons/io';

import st            from 'ryscott-st';
import {ax, helpers} from 'util';

const Admin = function({open, setOpen}) {
  if (!open) {return};

  return (
    <div className='admin v'>
      <div className='adminPanel v'>
        <Close className='adminClose' size={32} onClick={()=>{setOpen(false)}}/>
      </div>
    </div>
  )
};

export default Admin;

