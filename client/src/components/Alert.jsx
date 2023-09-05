import React, { useState, useEffect } from 'react';

import st            from 'ryscott-st';
import {ax, helpers} from 'util';

var to1, to2;

const Alert = () => {
  const [alerts, setAlerts] = st.newState('alerts', useState(0));
  const [alert, setAlert]   = st.newState('alert', useState(false));
  const [vis, setVis] = useState('hidden');

  useEffect(function() {
    if (!alert) {return;}

    clearTimeout(to1);
    clearTimeout(to2);

    setVis('');

    to1 = setTimeout(function() {
      setVis('hidden');

      to2 = setTimeout(()=>{setAlert(false)}, 1000);
    }, 2500);
  }, [alerts]);

  return (
    <div className={`alert ${vis} v`}>
      {alert}
    </div>
  );
};

export default Alert;