import React, {lazy, useEffect, useState} from 'react';
import {MdMinimize as Min} from "react-icons/md";

import st from 'ryscott-st';
import {helpers} from 'util';

const updates = [
  { user: "John", update: "Just witnessed some crazy stuff on the streets. Creatures everywhere!" },
  { user: "Betty", update: "Government rumors flying around. Time to stock up and make some alliances." },
  { user: "Gertrude", update: "My gadgets are turning against me! Disconnecting and finding refuge in the wild." },
  { user: "Mo", update: "More UFO sightings today. Joining the resistance to figure out what's up there." },
  { user: "Mo", update: "Infections spreading like wildfire. Setting up a quarantine zone. Need a cure ASAP." },
  { user: "Mo", update: "Detected nuclear fallout. Going underground and adapting to the new normal." },
  { user: "Mohammad", update: "Experiencing psychic disturbances. Meditating and connecting with other sensitives for insights." },
  { user: "Mo", update: "Reality warping all around me. Navigating through surreal landscapes. What a trip!" },
  { user: "John", update: "Alien forces intensifying. Humanity uniting for a stand. Ready for whatever comes our way." },
  { user: "Alice", update: "Codes and signals disrupted. Deciphering patterns and decrypting the unknown." }
];

const Global = function({user}) {
  var renderMessages = function() {
    var rendered = [];

    updates.map(function(update, i) {
      rendered.push(
        <div key={update.user + '_' + i} className='globalEntry v'>
          <b>{update.user}</b>
          <div style={{marginLeft: '4px'}}>{update.update}</div>
        </div>
      );
    })

    return rendered;
  };

  return (
    <div className='globalMessages v'>
      {renderMessages()}
    </div>
  );
};

export default Global;

