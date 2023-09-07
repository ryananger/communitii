import Pusher from 'pusher-js';

var pusher = new Pusher('0a0e51c374872fcb1ee0', {
  cluster: 'us2'
});

export default pusher;