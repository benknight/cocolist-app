/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import firebase from 'firebase/app';
import '@cocolist/thumbprint-global-css';
import '@cocolist/thumbprint-atomic';
import '@cocolist/thumbprint-scss';
import './src/styles/global.scss';
import React from 'react';
// import AuthProvider from './src/components/AuthProvider';
import IntlProvider from './src/components/IntlProvider';
import { isValidLang, getLocalizedURL, parseLangFromURL } from './src/lib/i18n';

export const onClientEntry = () => {
  const { location, localStorage, navigator } = window;
  const clientLang = navigator.language.split('-')[0];
  const langSelection = localStorage.getItem('langSelection');
  const targetLang = langSelection || clientLang;
  if (isValidLang(targetLang)) {
    const lang = parseLangFromURL(location.pathname);
    if (lang !== targetLang) {
      location.replace(getLocalizedURL(location.pathname, targetLang));
    }
  }
};

export const wrapPageElement = ({ element, props }) => (
  <IntlProvider location={props.location}>
    {/* <AuthProvider location={props.location}> */}
    {element}
    {/* </AuthProvider> */}
  </IntlProvider>
);

var firebaseConfig = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: 'cocolist-app.firebaseapp.com',
  databaseURL: 'https://cocolist-app.firebaseio.com',
  projectId: 'cocolist-app',
  storageBucket: 'cocolist-app.appspot.com',
  messagingSenderId: '665301945275',
  appId: '1:665301945275:web:15bc0317862ae1da',
};

firebase.initializeApp(firebaseConfig);
