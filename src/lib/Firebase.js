import Firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: 'cocolist-app.firebaseapp.com',
  databaseURL: 'https://cocolist-app.firebaseio.com',
  projectId: 'cocolist-app',
  storageBucket: 'cocolist-app.appspot.com',
  messagingSenderId: '665301945275',
  appId: '1:665301945275:web:15bc0317862ae1da',
};

Firebase.initializeApp(config);

export default Firebase;
