import st from 'ryscott-st';
import {ax, firebase} from 'util';

var helpers = {
  rand: function(num) {
    return Math.floor(Math.random() * num);
  },
  cookieParse: function() {
    var split = document.cookie.replaceAll(' ', '').split(';');
    var cookie = {};

    if (!split[0]) {
      cookie = {user: null};
    } else {
      split.map(function(entry) {
        var pair = entry.split('=');

        cookie[pair[0]] = pair[1];
      })
    }

    return cookie;
  },
  alert: function(text) {
    st.setAlerts(st.alerts + 1);
    st.setAlert(text);
  },
  logOut: function() {
    document.cookie = 'user=;';
    firebase.logOut();
    helpers.alert('Logout successful!');
    st.setUser(null);
  },

  abbrState: function(input, to) {
    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to == 'abbr'){
        input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for (var i = 0; i < states.length; i++){
            if(states[i][0] == input){
                return(states[i][1]);
            }
        }
    } else if (to == 'name'){
        input = input.toUpperCase();
        for (var i = 0; i < states.length; i++){
            if(states[i][1] == input){
                return(states[i][0]);
            }
        }
    }
  },
  renderPhone: function(num) {
    return num && num.slice(0, 3) + '-' + num.slice(3, 6) + '-' + num.slice(6);
  },
  strToObj: function(str) {
    if (!str) {
      return {m: 0, f: 0};
    }

    var split = str.replaceAll(' ', '').split(',');

    return {m: Number(split[0]) || 0, f: Number(split[1]) || 0};
  },
  validPhone: function(str) {
    var num = str.replace(/[^a-zA-Z0-9]/g,'');

    if (Number(num) && num.length === 10) {
      return num;
    } else {
      helpers.alert('Invalid phone.');
      return false;
    }
  },
  validEmail: function(str) {
    var valid = str.match(/[\w-\.]+@[\w-\.]+.[\w]/g);

    if (valid) {
      return str;
    } else {
      helpers.alert('Invalid email.');
      return false;
    }
  },
  timeSince: function (date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) === 1 ? '1 year' : Math.floor(interval) + " years";
    }

    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) === 1 ? '1 month' : Math.floor(interval) + " months";
    }

    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) === 1 ? '1 day' : Math.floor(interval) + " days";
    }

    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) === 1 ? '1 hour' : Math.floor(interval) + " hours";
    }

    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) === 1 ? '1 minute' : Math.floor(interval) + " minutes";
    }
    if (interval > 15) {
      return Math.floor(interval) + " seconds";
    }
    return null;
  },
  resizeImage: function(file, width, resolve) {
    var reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = function() {
      const img = new Image();
      img.src = reader.result.toString();

      img.onload = function() {
        if (width > img.width) {
          resolve(file);
          return;
        }

        const elem = document.createElement('canvas');
        const scaleFactor = width / img.width;

        elem.width = width;
        elem.height = img.height * scaleFactor;

        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);

        ctx.canvas.toBlob((blob) => {
          var resizedImage = new File([blob], file.name, {type: 'image/jpeg'});

          resolve(resizedImage);
        }, 'image/jpeg', 1);
      };
    }
  },
  transformFeed: function(feed) {
    var posts = [];

    feed.map(function(post) {
      if (!post.parent) {
        post.replies = [];
        posts.push(post);
      } else {
        posts.map(function(chk, i) {
          if (chk._id === post.parent) {
            posts[i].replies.push(post);
          }
        })
      }
    });

    return posts;
  },
  sortFeed: function(feed) {
    feed.sort(function(a, b) {
      var keyA = new Date(a.createdOn),
          keyB = new Date(b.createdOn);

      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;

      return 0;
    });
  }
};

export default helpers;