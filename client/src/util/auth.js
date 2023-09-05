import { initializeApp } from "firebase/app";
import { getAuth,
         createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         signOut } from "firebase/auth";

import ax from './ax.js';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "communitii.firebaseapp.com",
  projectId: "communitii",
  storageBucket: "communitii.appspot.com",
  messagingSenderId: "912689851818",
  appId: "1:912689851818:web:5ad1080b265966b63d4fd3",
  measurementId: "G-ZFQ6DNRZP7"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

var signUp = function(user) {
  createUserWithEmailAndPassword(auth, user.email, user.password)
    .then((userCredential) => {
      user.uid = userCredential.user.uid;

      ax.createUser(user);
      console.log('Created firebase user.');
    })
    .catch((error) => {
      console.log(error);
    });
};

var signIn = function(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      var user = userCredential.user;

      console.log('Firebase signIn successful.');

      ax.getUser(user.uid);
    })
    .catch((error) => {
      console.log(error);
    });
};

var logOut = function() {
  signOut(auth).then(() => {
    console.log('Firebase signOut successful.');
  }).catch((error) => {
    console.log(error);
  });
};

var methods = {
  signUp: signUp,
  signIn: signIn,
  logOut: logOut
};

export default methods;