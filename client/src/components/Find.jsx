import React, {useEffect, useState} from 'react';

import st            from 'ryscott-st';
import {ax, helpers} from 'util';

const Find = function() {
  const [mode, setMode] = useState(null);

  var CreateForm = function() {
    return (
      <form id='createForm' className='createForm v' onSubmit={handleSubmit}>
        <input name='community' placeholder='community name?'/>
        <div className='privacy h c'>
          Private?
          <select name='privacy'>
            <option value={true}>yes</option>
            <option value={false}>no</option>
          </select>
        </div>
        <input className='formSubmit' type='submit' value='create!'/>
      </form>
    );
  };

  var renderMode = function() {
    if (mode === 'find') {
      return 'find';
    } else if (mode === 'create') {
      return <CreateForm/>;
    }
  };

  var handleClick = function(mode) {
    if (st.user) {
      setMode('create');
    } else {
      helpers.alert('You must be logged in to do that!');
    }
  };

  var handleSubmit = function(e) {
    e.preventDefault();

    var form = e.target;

    var createInfo = {
      name: form.name.value,
      privacy: form.privacy.value
    };

    console.log(createInfo);
  };

  useEffect(()=>{
    if (!st.user) {
      setMode(null);
    }
  }, [st.user]);

  return (
    <div className='findCommunity v'>
      <div className='communityButtons v'>
        <div className='communityInput h'>
          <input placeholder='find a community'/>
          <div className='go v c'>GO</div>
        </div>
        <div className='communityButton v c' onClick={()=>{handleClick('create')}}>
          create a community
        </div>
      </div>
      {renderMode()}
    </div>
  )
};

export default Find;

