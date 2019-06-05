import cx from 'classnames';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Wrap } from '@cocolist/thumbprint-react';
import logo from '../assets/logo.svg';
import { getLocalizedURL, parseLangFromURL } from '../lib/i18n';
import Search from './Search';
import styles from './Header.module.scss';

const Header = ({ location, showSearch }) => {
  const lang = parseLangFromURL(location.pathname);
  const [isScrolled, setScrolled] = useState(false);
  useEffect(() => {
    let ticking = false;
    let scrollPos = 0;
    const listener = event => {
      scrollPos = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(scrollPos > 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', listener);
    return () => window.removeEventListener('scroll', listener);
  });
  return (
    <header
      className={cx(styles.container, 'z-2 pb2 pt3 bg-white', {
        [styles.hasShadow]: isScrolled,
      })}>
      <div className="flex items-center ph3">
        <Link className="inline-flex mb1" to={getLocalizedURL('/', lang)}>
          <img alt="logo" className={styles.logo} src={logo} />
        </Link>
        <div className="mh3 m_mh4 flex-auto">
          {showSearch && (
            <div className={styles.searchWrapper}>
              <Search className="m_relative" location={location} />
            </div>
          )}
        </div>
        <div className="tp-body-3 b nowrap">
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
      </div>
    </header>
  );
};

Header.propTypes = {
  location: PropTypes.object.isRequired,
  showSearch: PropTypes.bool,
};

Header.defaultProps = {
  showSearch: true,
};

export default Header;
