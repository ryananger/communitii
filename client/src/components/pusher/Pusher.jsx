import React, {useEffect, useState} from 'react';

import st from 'ryscott-st';
import pusher from './pusher.js';
import {ax, helpers} from 'util';

const Pusher = function({admin}) {
  const [userMount, setUserMount] = useState(false);
  const [commMount, setCommMount] = useState(false);
  const [postMount, setPostMount] = useState(false);

  var mountUser = function() {
    if (!st.user) {setUserMount(false)};

    if (st.user && !userMount) {
      const userChannel = pusher.subscribe(`${st.user.uid}`);

      userChannel.bind('userUpdate', function(data) {
        if (data.update) {
          helpers.alert(data.update.text);
        }

        ax.getUser(st.user.uid);
        console.log('in userUpdate', data);
      });

      setUserMount(true);

      console.log('userPusherMount');
    }
  };

  var mountComm = function() {
    if (!st.community) {setCommMount(false)};

    if (st.community && !commMount) {
      const communityChannel = pusher.subscribe(`${st.community._id}`);

      if (isAdmin()) {
        communityChannel.bind('adminUpdate', function(data) {
          helpers.alert('New community notification.');
          st.setCommunity({...st.community, notifications: data});
        });
      }

      communityChannel.bind('communityUpdate', function(data) {
        ax.getCommunity(st.user.community);
      });

      setCommMount(true);

      console.log('commPusherMount');
    }
  };

  var mountPost = function() {
    if (!st.post) {
      pusher.unsubscribe(postMount);
    } else {
      const postChannel = pusher.subscribe(st.post._id);

      postChannel.bind('postUpdate', function() {
        ax.getPost(st.post._id);
      })

      setPostMount(st.post._id);
    }
  };

  var isAdmin = function() {
    var result = false;

    st.community.members.map(function(member) {
      if (member.uid === st.user.uid) {
        result = member.admin;
      }
    });

    return result;
  };

  useEffect(mountUser, [st.user]);
  useEffect(mountComm, [st.community]);
  useEffect(mountPost, [st.post]);
};

export default Pusher;

