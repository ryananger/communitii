const mongoose = require('mongoose');
const url = process.env.MONGODB;
const options = {useNewUrlParser: true, useUnifiedTopology: true};

mongoose.set('strictQuery', true);
mongoose.connect(url, options, function(a) {
  console.log('Connected to mongoDB.');
});

const userSchema = new mongoose.Schema({
  uid:       String, // from firebase auth
  username:  String,
  firstName: String,
  lastName:  String,

  createdOn: {type: Date, default: Date.now},

  email:     String,
  phone:     String,

  community: String,
  settings: Object,

  notifications: [Object],
  friends: [String],
  interactions: [Object],
  messages: [Object],
  posts:    [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
  events:   [Object]
});

const communitySchema = new mongoose.Schema({
  name:     String,
  settings: Object,
  private:  Boolean,

  notifications: [Object],
  members:  [{admin: Boolean, uid: String}],
  messages: [Object],
  feeds: {
    home:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    learn: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    grow:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    work:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    play:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    help:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]
  },
  events:  [Object]
});

const postSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  community: String,
  feed: String,
  text: String,
  parent: String,
  media: [Object],
  replies: [String],

  createdOn: {type: Date, default: Date.now},
  likes: [String]
});

const User = new mongoose.model('User', userSchema);
const Community = new mongoose.model('Community', communitySchema);
const Post = new mongoose.model('Post', postSchema);

var models = {
  User: User,
  Community: Community,
  Post: Post
};

module.exports = models;