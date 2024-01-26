import React, {useEffect, useState} from 'react';
import icons from 'icons';

import 'styles';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

const CommunityHead = function({community, open}) {

  return (
    <div className='communityHead h'>
      <h4>{community.name}</h4>
      <icons.SettingsIcon className='adminSettingsButton grow' size={20} onClick={()=>{open(true)}}/>
    </div>
  )
};

export default CommunityHead;

