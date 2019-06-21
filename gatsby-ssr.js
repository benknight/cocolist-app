/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */
import React from 'react';
import IntlProvider from './src/components/IntlProvider';

export const wrapPageElement = ({ element, props }) => (
  <IntlProvider {...props}>{element}</IntlProvider>
);
