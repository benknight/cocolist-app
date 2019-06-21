import cx from 'classnames';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { TextButton } from '@cocolist/thumbprint-react';
import {
  NavigationCaretDownTiny,
  NavigationCaretUpTiny,
} from '@thumbtack/thumbprint-icons';
import logo from '../assets/logo.svg';
import { getLocalizedURL, parseLangFromURL } from '../lib/i18n';
import { AuthContext } from './AuthProvider';
import Search from './Search';
import styles from './Header.module.scss';

const cacheLangPreference = lang => window.localStorage.setItem('langSelection', lang);

const LangSwitch = props => (
  <div className={cx(styles.lang, { [styles.truncate]: props.truncate })}>
    {props.lang === 'en' ? (
      <Link
        onClick={() => cacheLangPreference('vi')}
        to={getLocalizedURL(props.location.pathname, 'vi')}>
        <span className={cx(styles.langLong)}>Tiếng Việt</span>
        <span className={cx(styles.langShort, 'pa2')}>VN</span>
      </Link>
    ) : (
      <Link
        onClick={() => cacheLangPreference('en')}
        to={getLocalizedURL(props.location.pathname, 'en')}>
        <span className={cx(styles.langLong)}>Switch to English</span>
        <span className={cx(styles.langShort, 'pa2')}>EN</span>
      </Link>
    )}
  </div>
);

const Header = ({ location, showSearch }) => {
  const lang = parseLangFromURL(location.pathname);
  const [isScrolled, setScrolled] = useState(false);
  const [isNavExpanded, setNavExpanded] = useState(false);
  const { user } = useContext(AuthContext);
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
  const aboutLink = (
    <Link
      activeClassName="tp-link--inherit"
      className="tp-link"
      to={getLocalizedURL('/about', lang)}>
      <FormattedMessage id="header_link_about" />
    </Link>
  );
  return (
    <header
      className={cx(styles.container, 'z-2 bg-white', {
        [styles.hasShadow]: isScrolled,
        [styles.noSearch]: !showSearch,
      })}>
      <div className="relative z-1 flex items-center pb2 pt3 pl3 l_pr3">
        <Link className="inline-flex mb1 mr3 m_mr4" to={getLocalizedURL('/', lang)}>
          <img alt="logo" className={styles.logo} src={logo} />
        </Link>
        {showSearch && (
          <div className="mr3 m_dn">
            <TextButton
              accessibilityLabel="Open Cocolist navigation"
              iconLeft={
                isNavExpanded ? <NavigationCaretUpTiny /> : <NavigationCaretDownTiny />
              }
              onClick={() => setNavExpanded(!isNavExpanded)}
              theme="inherit"
            />
          </div>
        )}
        <div className="flex-auto">
          {showSearch && user && (
            <div className={styles.searchWrapper}>
              <Search className="m_relative" location={location} size="small" />
            </div>
          )}
        </div>
        <div className="flex items-baseline b nowrap">
          <div className={cx('mh2 m_ml4 l_mr4', { 'dn m_db': showSearch })}>
            {aboutLink}
          </div>
          <div className="mh2 m_mr3 ph1">
            <LangSwitch {...{ lang, location }} truncate={showSearch} />
          </div>
        </div>
      </div>
      <div className={cx(styles.nav, 'bg-white pa3 z-0 b', { dn: !isNavExpanded })}>
        {aboutLink}
        <LangSwitch {...{ lang, location }} />
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
