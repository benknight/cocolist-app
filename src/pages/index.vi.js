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
      <h2 className="f3 f2-l mw6">
        Ứng dụng tìm địa chỉ thân thiện môi trường tại Sài Gòn
      </h2>
      <p>
        <a href="https://cocolist.app/docs/tieng-viet">Đọc thêm</a>
      </p>
    </div>
  </Page>
);
