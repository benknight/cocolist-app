/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import '@thumbtack/thumbprint-global-css';
import '@thumbtack/thumbprint-atomic';
import '@thumbtack/thumbprint-scss';
import './src/styles/global.scss';
import React from 'react';
import IntlProvider from './src/components/IntlProvider';
import { isValidLang, getLocalizedURL, parseLangFromURL } from './src/lib/common/i18n';
import { AuthProvider } from './src/lib/useAuth';

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

export const wrapPageElement = ({ element, props }) => (
  <IntlProvider location={props.location}>
    <AuthProvider>{element}</AuthProvider>
  </IntlProvider>
);
