import st      from 'ryscott-st';
import ax      from './ax.js';
import helpers from './helpers.js';

var mouse = {
  x: null,
  y: null,
  over: null
};

window.addEventListener('mousemove', function(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  var element = document.elementFromPoint(mouse.x, mouse.y);

  mouse.over = element ? element : null;
}, {passive: true});

window.addEventListener('keypress', function(e) {
  if (e.target.type === 'text') {return};

  switch (e.key) {
    case 'f':
      helpers.alert('Someone pressed F.');
      break;
    case 'm':
      console.log(mouse);
      break;
  }
});

export default mouse;