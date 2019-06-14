import cx from 'classnames';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
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
  const cacheLangPreference = lang => window.localStorage.setItem('langSelection', lang);
  return (
    <header
      className={cx(styles.container, 'z-2 pb2 pt3 bg-white', {
        [styles.hasShadow]: isScrolled,
        [styles.noSearch]: !showSearch,
      })}>
      <div className="flex items-center pl3 l_pr3">
        <Link className="inline-flex mb1 mr3 m_mr4" to={getLocalizedURL('/', lang)}>
          <img alt="logo" className={styles.logo} src={logo} />
        </Link>
        <div className="flex-auto">
          {showSearch && (
            <div className={styles.searchWrapper}>
              <Search className="m_relative" location={location} size="small" />
            </div>
          )}
        </div>
        <div className="flex items-baseline tp-body-2 b nowrap">
          <Link
            activeClassName="tp-link--inherit"
            className="tp-link dn m_db mh4"
            to={getLocalizedURL('/about', lang)}>
            <FormattedMessage id="header_link_about" />
          </Link>
          <div className={styles.lang}>
            {lang === 'en' ? (
              <Link
                onClick={() => cacheLangPreference('vi')}
                to={getLocalizedURL(location.pathname, 'vi')}>
                <span className={cx(styles.langLong, 'mh2 ph1')}>Tiếng Việt</span>
                <span className={cx(styles.langShort, 'pa3')}>VN</span>
              </Link>
            ) : (
              <Link
                onClick={() => cacheLangPreference('en')}
                to={getLocalizedURL(location.pathname, 'en')}>
                <span className={cx(styles.langLong, 'mh2 ph1')}>Switch to English</span>
                <span className={cx(styles.langShort, 'pa3')}>EN</span>
              </Link>
            )}
          </div>
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
