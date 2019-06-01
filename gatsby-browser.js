import '@cocolist/thumbprint-global-css';
import '@cocolist/thumbprint-atomic';
import '@cocolist/thumbprint-scss';
import './src/styles/global.scss';
import React from 'react';
import PageWrap from './src/components/PageWrap';
import { isValidLang, getLocalizedURL, parseLangFromURL } from './src/lib/i18n';

// TODO: Store user lang preference in localStorage
export const onClientEntry = () => {
  const { location, navigator } = window;
  const clientLang = navigator.language.split('-')[0];
  if (isValidLang(clientLang)) {
    const lang = parseLangFromURL(location.pathname);
    if (lang !== clientLang) {
      location.replace(getLocalizedURL(location.pathname, clientLang));
    }
  }
};

export const wrapPageElement = ({ element, props }) => (
  <PageWrap {...props}>{element}</PageWrap>
);
