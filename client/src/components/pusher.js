import Pusher from 'pusher-js';

var pusher = new Pusher(process.env.PUSHER_KEY, {
  cluster: 'us2'
});

export default pusher;