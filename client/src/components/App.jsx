import React, {useEffect, useState} from 'react';

import 'styles';
import st from 'ryscott-st';
import Nav from './Nav.jsx';
import Home from './feeds/Home.jsx';
import Login from './Login.jsx';
import Alert from './Alert.jsx';

const App = function() {
  const [view, setView] = st.newState('view', useState('home'));
  const [user, setUser] = st.newState('user', useState(null));

  const views = {
    home: <Home/>,
    login: <Login/>
  };

  return (
    <div className='app v'>
      <Alert />
      <Nav />
      <div className='main h'>
        <div className='social v'>
          <div className='friends v'>

          </div>
          <div className='chat v'>

          </div>
        </div>
        <div className='feed v'>
          {views[view] || view}
        </div>
        <div className='wing v'>
          <div className='updates v'>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

