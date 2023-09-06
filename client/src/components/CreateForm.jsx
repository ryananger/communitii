import React, {useEffect, useState} from 'react';

import st            from 'ryscott-st';
import {ax} from 'util';

const CreateForm = function() {
  var handleSubmit = function(e) {
    e.preventDefault();

    var form = e.target;

    var community = {
      name: form.name.value,
      private: form.privacy.value,
      members: [{admin: true, uid: st.user.uid}]
    };

    var sendBody = {
      uid: st.user.uid,
      community
    };

    ax.createCommunity(sendBody);
  };

  return (
    <form id='createForm' className='createForm v' onSubmit={handleSubmit}>
      <input name='name' placeholder='community name?'/>
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

export default CreateForm;

