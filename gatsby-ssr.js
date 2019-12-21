/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */
import React from 'react';
import { AuthProvider } from './src/lib/useAuth';
import IntlProvider from './src/components/IntlProvider';

export const wrapPageElement = ({ element, props }) => (
  <IntlProvider {...props}>
    <AuthProvider>{element}</AuthProvider>
  </IntlProvider>
);
