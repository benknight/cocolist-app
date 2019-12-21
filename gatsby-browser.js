/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import Firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import '@thumbtack/thumbprint-global-css';
import '@thumbtack/thumbprint-atomic';
import '@thumbtack/thumbprint-scss';
import './src/styles/global.scss';
import React from 'react';
import IntlProvider from './src/components/IntlProvider';
import { isValidLang, getLocalizedURL, parseLangFromURL } from './src/lib/common/i18n';
import { AuthProvider } from './src/lib/useAuth';
import { FirebaseContext } from './src/lib/useFirebase';

export const onClientEntry = () => {
  const { location, localStorage, navigator } = window;

  // Obey user language selection, defaulting to browser lang
  const clientLang = navigator.language.split('-')[0];
  const langSelection = localStorage.getItem('langSelection');
  const targetLang = langSelection || clientLang;

  if (isValidLang(targetLang)) {
    const lang = parseLangFromURL(location.pathname);
    if (lang !== targetLang) {
      location.replace(getLocalizedURL(location.pathname, targetLang));
      return;
    }
  }
};

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

export const wrapPageElement = ({ element, props }) => (
  <FirebaseContext.Provider value={Firebase}>
    <IntlProvider location={props.location}>
      <AuthProvider>{element}</AuthProvider>
    </IntlProvider>
  </FirebaseContext.Provider>
);
