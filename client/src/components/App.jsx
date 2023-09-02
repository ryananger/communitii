import React, {lazy, useEffect, useState} from 'react';

import 'styles';
import st from 'ryscott-st';

import ContactButtons from './ContactButtons.jsx';
import SmoothImage from './SmoothImage.jsx';
import Lazy from './Lazy.jsx';
import Tile from './Tile.jsx';
import Slide from './Slide.jsx';
import Header from './tiles/Header.jsx';
import Help from './tiles/Help.jsx';
import Main from './tiles/Main.jsx';
import Orbit from './Orbit.jsx';
import MainTile from './MainTile.jsx';

const App = function() {
  const [view, setView] = st.newState('view', useState('web'));

  return (
    <div id='app' className='app v'>
      <Tile bg={'leaf'} height={10} left={<Slide dir={'left'}><Header/></Slide>}/>
      <Tile
        bg={'banana'}
        height={60}
        className={'intro'}
        right={
          <Slide dir={'right'} time={1.5} delay={1}>
            <div style={{width: '90%', textAlign: 'right'}}><h1>do you have technology needs?</h1></div>
          </Slide>
        }
        left={
          <Slide dir={'left'} time={2} delay={2}>
            <div style={{height: '90%', width: '90%'}}><h3>interested in stepping gracefully into the future?</h3></div>
          </Slide>
        }
        center={
          <Orbit />
        }
        open={1}
      />
      <Tile bg={'peach'} height={25} open={1} center={<Help/>}/>
      {/* <Below /> */}
      <MainTile center={<Main />}/>
      <Tile bg={'leaf'} height={10} center={<ContactButtons />}/>
    </div>
  );
};

export default App;

