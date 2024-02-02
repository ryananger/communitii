import React, {useEffect, useState} from 'react';

import 'styles';
import st from 'ryscott-st';
import pusher from './pusher/pusher.js';
import {ax, helpers} from 'util';

import RandomPathsSVG from './RandomPathsSVG.jsx';
import Nav from './nav/Nav.jsx';

import Card from './cards/Card.jsx';
import ActionBox from './ActionBox.jsx';
import Friends from './cards/Friends.jsx';
import Chat from './cards/chat/Chat.jsx';
import ChatWith from './cards/chat/ChatWith.jsx';
import Global from './cards/Global.jsx';

import Home from './feeds/Home.jsx';
import Page from './feeds/Page.jsx';
import PostView from './feeds/PostView.jsx';
import Profile from './feeds/profile/Profile.jsx';
import UserProfile from './feeds/profile/UserProfile.jsx';
import Login from './Login.jsx';
import Alert from './Alert.jsx';

import Pusher from './pusher/Pusher.jsx';
import Find from './find/Find.jsx';
import Admin from './admin/Admin.jsx';
import CommunityUpdates from './admin/CommunityUpdates.jsx';
import CommunityHead from './admin/CommunityHead.jsx';

const cookie = helpers.cookieParse();

const App = function() {
  const [view, setView] = st.newState('view', useState('find'));
  const [color, setColor] = st.newState('color', useState('home'));
  const [user, setUser] = st.newState('user', useState(null));
  const [post, setPost] = st.newState('post', useState(null));
  const [community, setCommunity] = st.newState('community', useState(null));
  const [profile, setProfile] = st.newState('profile', useState(null));
  const [chatWith, setChatWith] = st.newState('chatWith', useState(null));

  const [isAdmin, setIsAdmin] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);

  st.colors = ['home', 'learn', 'grow', 'work', 'play', 'help'];

  const views = {
    home:  <Home/>,
    learn: <Page feed='learn'/>,
    grow:  <Page feed='grow'/>,
    work:  <Page feed='work'/>,
    play:  <Page feed='play'/>,
    help:  <Page feed='help'/>,
    login: <Login />,
    find:  <Find />,
    profile: <Profile profile={profile}/>,
    userProfile: <UserProfile />,
    postView: <PostView post={post}/>,
    chat: <ChatWith />
  };

  var userFromCookie = function() {
    if (!user && cookie.user) {
      ax.getUser(cookie.user);
    }
  };

  var handleUser = function() {
    if (user && user.community && !community) {
      ax.getCommunity(user.community);
    } else if (!user) {
      setView('find');
      setIsAdmin(false);
      setCommunity(null);
    }
  };

  var handleCommunity = function() {
    if (!community) {return};

    if (setIsAdmin === null) {
      community.members.map(function(member) {
        if (member.uid === user.uid) {
          setIsAdmin(member.admin);
        }
      });
    }

    ax.getUser(user.uid);
  };

  var handleProfile = function() {
    if (profile) {
      setView('profile');
    }
  };

  var handleView = function() {
    if (['find', 'profile', 'userProfile'].includes(view)) {
      setColor('home');
    } else if (view !== 'postView' && view !== 'chat') {
      setColor(view);
    }

    scrollToTop();
  };

  var scrollToTop = function() {
    var feedEl = document.getElementById('feed');

    feedEl && feedEl.scrollTo({top: 0, behavior: 'smooth'});
  };

  useEffect(userFromCookie, []);
  useEffect(handleUser, [user]);
  useEffect(handleCommunity, [community]);
  useEffect(handleProfile, [profile]);
  useEffect(handleView, [view]);
  useEffect(()=>{post && setView('postView')}, [post]);

  if (!user || !user.community) {
    return (
      <div className='app v'>
        <Alert />
        <Nav user={user}/>
        <div className='main h'>
          <div className='feed v'>
            {views[view] || view}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='app v'>
      <Alert />
      <Pusher />
      <Nav user={user}/>
      <RandomPathsSVG color={color}/>
      <div className='main h'>
        <div className='social v'>
          <ActionBox />
          <Card type='friends' content={<Friends />}/>
          <Card type='chat' content={<Chat />}/>
        </div>
        <div id='feed' className='feed v'>
          {views[view] || view}
        </div>
        <div className='wing v'>
          <div className='communityUpdateCard card v'>
            {community && <CommunityHead community={community} open={setAdminOpen}/>}
            {community && <CommunityUpdates community={community}/>}
          </div>
          <Card type='global' content={<Global />}/>
        </div>
      </div>
      {isAdmin && <Admin open={adminOpen} setOpen={setAdminOpen}/>}
    </div>
  );
};

export default App;

