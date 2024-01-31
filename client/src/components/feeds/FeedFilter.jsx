import React, {lazy, useEffect, useState} from 'react';
import st from 'ryscott-st';

const FeedFilter = function() {
  var colors = ['home', 'learn', 'grow', 'work', 'play', 'help'];

  var toggleFilter = function(color) {
    var filter = st.homeFilter;

    if (filter.includes(color)) {
      var split = filter.split(color + ' ');

      filter = split[0].concat(split[1]);

      st.setHomeFilter(filter);
    } else {
      st.setHomeFilter(filter + color + ' ');
    }
  };

  var renderFilters = function() {
    var rendered = [];

    colors.map(function(color) {
      var style = {backgroundColor: `var(--${color})`, color: `var(--${color})`};
      var tag = !st.homeFilter.includes(color) ? 'filterOff' : '';

      rendered.push(
        <div key={`${color}Filter`} className={`filterCircle ${tag}`} style={style} onClick={()=>{toggleFilter(color)}}>
            <div className='filterLine' style={style}/>
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

