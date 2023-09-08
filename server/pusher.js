const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1666752",
  key: process.env.PUSHER_KEY,
  secret: "2860053d6d4de92b6544",
  cluster: "us2",
  useTLS: true
});

module.exports = pusher;