import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';
import {helpers} from 'util';

const Badges = function({roles}) {
  var renderBadges = function() {
    var rendered = [];

    roles.map(function(role, i) {
      var color = st.colors[i + 1];

      rendered.push(
        <div key={role} className='badge' style={{backgroundColor: `var(--${color})`}}>
          {role.toUpperCase()}
        </div>
      )
    })

    return rendered;
  };

  return (
    <div className='badges h'>
      {renderBadges()}
    </div>
  );
};

export default Badges;

