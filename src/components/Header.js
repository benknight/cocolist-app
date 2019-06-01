import cx from 'classnames';
import { Link } from 'gatsby';
import React from 'react';
import logo from '../assets/logo.svg';
import { getLocalizedURL, parseLangFromURL } from '../lib/i18n';
import Search from './Search';
import styles from './Header.module.scss';

const Header = ({ location }) => {
  const lang = parseLangFromURL(location.pathname);
  return (
    <header
      className={cx(
        styles.container,
        'flex items-center l_justify-center bb b-gray-300 pb2 pt3 ph3 bg-white',
      )}>
      <img alt="logo" className={cx(styles.logo, 'mb1')} src={logo} />
      <div className="mh3 m_mh4 flex-auto l_flex-none">
        <div className={styles.searchWrapper}>
          <Search />
        </div>
      </div>
      <div className="tp-body-3 b">
        {lang === 'en' ? (
          <Link to={getLocalizedURL(location.pathname, 'vi')}>
            <span className="dn m_dib mr2">
              <span
                className={cx(styles.emoji, 'dib mr1')}
                role="img"
                aria-label="Vietnam">
                🇻🇳
              </span>
              tiếng Việt
            </span>
            <span className="dib m_dn mr1">VN</span>
          </Link>
        ) : (
          <Link to={getLocalizedURL(location.pathname, 'en')}>
            <span className="dn l_dib mr2">Switch to English</span>
            <span className="dn m_dib l_dn mr2">English</span>
            <span className="dib m_dn mr1">EN</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
