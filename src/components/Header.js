import cx from 'classnames';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { TextButton, Link as TPLink } from '@cocolist/thumbprint-react';
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
        title="Tiếng Việt"
        to={getLocalizedURL(props.location.pathname, 'vi')}>
        <span className={cx(styles.langLong)}>Tiếng Việt</span>
        <span className={cx(styles.langShort, 'pa2')}>VI</span>
      </Link>
    ) : (
      <Link
        onClick={() => cacheLangPreference('en')}
        to={getLocalizedURL(props.location.pathname, 'en')}
        title="English">
        <span className={cx(styles.langLong)}>Switch to English</span>
        <span className={cx(styles.langShort, 'pa2')}>EN</span>
      </Link>
    )}
  </div>
);

const Header = ({ location, showSearch, ...props }) => {
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
  const feedbackLink = (
    <TPLink to="mailto:feedback@cocolist.vn?subject=Beta%20feedback">
      <FormattedMessage id="header_link_feedback" />
    </TPLink>
  );
  const betaLink = (
    <Link
      activeClassName="tp-link--inherit"
      className="tp-link"
      to={getLocalizedURL('/signup', lang)}>
      <FormattedMessage id="header_link_beta" />
    </Link>
  );
  return (
    <header
      className={cx(styles.container, 'z-2 bg-white', {
        [styles.hasShadow]: isScrolled,
        [styles.noSearch]: !showSearch,
      })}>
      <div className="relative z-1 flex items-center pb2 pt3 ph3">
        <Link className="inline-flex mb1 mr3 m_mr4" to={getLocalizedURL('/', lang)}>
          <img alt="logo" className={styles.logo} src={logo} />
        </Link>
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
        <div className="flex-auto">
          {showSearch && (
            <div className={styles.searchWrapper}>
              <Search className="m_relative" location={location} size="small" />
            </div>
          )}
        </div>
        <div className="flex items-baseline b nowrap">
          {user && <div className="dn m_db ml5">{feedbackLink}</div>}
          {!user && <div className="dn m_db ml5">{betaLink}</div>}
          <Link
            activeClassName="tp-link--inherit"
            className={cx('tp-link ml5', { 'dn m_db': showSearch })}
            to={getLocalizedURL('/about', lang)}>
            <FormattedMessage id="header_link_about" />
          </Link>
          {props.showLangSwitch && (
            <div className="ml3 m_ml5">
              <LangSwitch {...{ lang, location }} truncate={showSearch} />
            </div>
          )}
        </div>
      </div>
      <div className={cx(styles.nav, 'bg-white pa3 z-0 b', { dn: !isNavExpanded })}>
        <Link
          activeClassName="tp-link--inherit"
          className="tp-link"
          to={getLocalizedURL('/about', lang)}>
          <FormattedMessage id="header_link_about" />
        </Link>
        {user ? feedbackLink : betaLink}
      </div>
    </header>
  );
};

Header.propTypes = {
  location: PropTypes.object.isRequired,
  showSearch: PropTypes.bool,
  showLangSwitch: PropTypes.bool,
};

Header.defaultProps = {
  showSearch: true,
  showLangSwitch: true,
};

export default Header;
