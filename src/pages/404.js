import React from 'react';
import Helmet from 'react-helmet';
import Header from '../components/Header';

export default props => (
  <>
    <Helmet>
      <title>Not found</title>
    </Helmet>
    <Header location={props.location} />
    <div className="ph4 pv6 tc">
      <h1>This page has moved or is no longer available.</h1>
    </div>
  </>
);
