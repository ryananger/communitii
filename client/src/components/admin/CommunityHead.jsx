import React, {useEffect, useState} from 'react';
import {AiFillSetting as SettingsIcon} from 'react-icons/ai';

import 'styles';
import st from 'ryscott-st';
import {ax, helpers} from 'util';

const CommunityHead = function({community, open}) {

  return (
    <div className='communityHead h'>
      <h4>{community.name}</h4>
      <SettingsIcon className='adminSettingsButton grow' size={20} onClick={()=>{open(true)}}/>
    </div>
  )
};

export default CommunityHead;

