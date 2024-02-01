import { initializeApp } from "firebase/app";
import { getAuth,
         createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         signOut } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, updateMetadata } from "firebase/storage";

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
const storage = getStorage(app);
const storageRef = ref(storage, 'images');

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

      ax.getUser(user.uid, true);
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

var uploadBlob = async function(file, path, resolve) {
  const imgRef = ref(storageRef, path);
  const meta = {contentType: file.type, cacheControl: 'public, max-age=31536000'};

  var url;

  uploadBytes(imgRef, file, meta).then(async (snapshot) => {
    url = await getDownloadURL(imgRef);

    if (resolve) {resolve(url)};
  });
};

var updateMeta = function(path) {
  const imgRef = ref(storage, path);

  updateMetadata(imgRef, {cacheControl: 'public, max-age=31536000'})
    .then((metadata)=>{
      console.log(metadata);
    })
};

var getURL = async function(path) {
  var gsRef = ref(storage, 'gs://communitii.appspot.com/images/' + path);
  var url = await getDownloadURL(gsRef);

  return url;
};

var methods = {
  signUp,
  signIn,
  logOut,
  uploadBlob,
  getURL,
  updateMeta
};

export default methods;