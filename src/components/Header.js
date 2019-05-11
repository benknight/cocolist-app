import cx from 'classnames';
import React from 'react';
import logo from '../assets/logo.svg';
import styles from './Header.module.css';

const Header = () => (
  <header className={cx(styles.container, 'flex bb b--light-gray pb2 pt3 ph3 bg-white')}>
    <img alt="logo" className={cx(styles.logo, 'mb1')} src={logo} />
  </header>
);

export default Header;
