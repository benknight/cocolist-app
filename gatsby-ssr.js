/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */
import React from 'react';
import PageWrap from './src/components/PageWrap';

export const wrapPageElement = ({ element, props }) => (
  <PageWrap {...props}>{element}</PageWrap>
);
