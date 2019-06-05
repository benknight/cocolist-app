import '@cocolist/thumbprint-global-css';
import '@cocolist/thumbprint-atomic';
import '@cocolist/thumbprint-scss';
import './src/styles/global.scss';
import React from 'react';
import PageWrap from './src/components/PageWrap';
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
  <PageWrap {...props}>{element}</PageWrap>
);
