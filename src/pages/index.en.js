import React from 'react';
import logo from '../assets/logo.svg';
import Page from '../components/Page';

export default props => (
  <Page className="pa4 mw7 center" {...props}>
    <div>
      <img
        alt=""
        className="l_mt2"
        src={logo}
        style={{ width: '4rem', height: 'auto' }}
      />
      <h1 className="tp-title-1 mt4" size={1}>
        Cocolist
      </h1>
      <div className="tp-title-2 mv4">Find eco-conscious businesses in Saigon</div>
      <p>
        Cocolist is currently under development. Read more at{' '}
        <a href="https://cocolist.vn">https://cocolist.vn</a>
      </p>
    </div>
  </Page>
);
