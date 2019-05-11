import React from 'react';
import logo from '../assets/logo.svg';
import Page from '../components/Page';

export default props => (
  <Page className="pa4 mw7 center" location={props.location}>
    <div>
      <img
        alt=""
        className="mt2-l"
        src={logo}
        style={{ width: '4rem', height: 'auto' }}
      />
      <h1 className="f2 f1-l">Cocolist</h1>
      <h2 className="f3 f2-l mw6">Find eco-conscious businesses in Saigon</h2>
      <p>
        Cocolist is currently under development. Read more at{' '}
        <a href="https://cocolist.vn">https://cocolist.vn</a>
      </p>
    </div>
  </Page>
);
