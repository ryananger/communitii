import React, {lazy, useEffect, useState} from 'react';

const FeedFilter = function({feed}) {
  var colors = ['home', 'learn', 'grow', 'work', 'play', 'help'];

  var renderFilters = function() {
    var rendered = [];

    colors.map(function(color) {
      rendered.push(
        <div className='filterCircle' style={{backgroundColor: `var(--${color})`, color: `var(--${color})`}}>
          <div className='filterLine'/>
        </div>
      );
    });

    return rendered;
  };

  return (
    <div className='feedFilter v'>
      {renderFilters()}
    </div>
  );
};

export default FeedFilter;

