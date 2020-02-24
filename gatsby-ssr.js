/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */
import React from 'react';
import { DOMParser } from 'xmldom';
import { AuthProvider } from './src/lib/useAuth';
import IntlProvider from './src/components/IntlProvider';

global.DOMParser = DOMParser;

export const wrapPageElement = ({ element, props }) => (
  <IntlProvider {...props}>
    <AuthProvider>{element}</AuthProvider>
  </IntlProvider>
);

export const onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([
    <script
      data-goatcounter="https://cocolist.goatcounter.com/count"
      async
      src="//gc.zgo.at/count.js"></script>,
  ]);
};
