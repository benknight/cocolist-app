import cx from 'classnames';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { TextButton } from '@cocolist/thumbprint-react';
import {
  NavigationCaretDownTiny,
  NavigationCaretUpTiny,
} from '@thumbtack/thumbprint-icons';
import logo from '../assets/logo.svg';
import { getLocalizedURL, parseLangFromURL } from '../lib/i18n';
import AddBusinessAction from './AddBusinessAction';
import Alert from './Alert';
import Search from './Search';
import SignupAction from './SignupAction';
import styles from './Header.module.scss';

const cacheLangPreference = lang => window.localStorage.setItem('langSelection', lang);

const LangSwitch = props => (
  <div
    className={cx(
      styles.lang,
      { [styles.truncate]: props.truncate },
      'dib br1 bg-gray-300 pv1 ph2',
    )}>
    {props.lang === 'en' ? (
      <Link
        onClick={() => cacheLangPreference('vi')}
        title="Tiếng Việt"
        to={getLocalizedURL(props.location.pathname, 'vi')}>
        <span
          aria-label="Tiếng Việt"
          className={cx(styles.langEmoji, 'ph1 dib')}
          role="img">
          🇻🇳
        </span>
        <span className={styles.langLong}>Tiếng Việt</span>
        <span className={styles.langShort}>VI</span>
      </Link>
    ) : (
      <Link
        onClick={() => cacheLangPreference('en')}
        to={getLocalizedURL(props.location.pathname, 'en')}
        title="English">
        <span className={styles.langLong}>English</span>
        <span className={styles.langShort}>EN</span>
      </Link>
    )}
  </div>
);

const Header = ({ location, showSearch, ...props }) => {
  const lang = parseLangFromURL(location.pathname);
  const [isScrolled, setScrolled] = useState(false);
  const [isNavExpanded, setNavExpanded] = useState(false);
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
    <>
      <Alert className="bg-green white" id="2019-09-09-opensource">
        <FormattedMessage id="open_source_alert" />{' '}
        <Link to="/about#opensource">
          <FormattedMessage id="read_more_action" />
        </Link>
        .
      </Alert>
      <header
        className={cx(styles.container, 'z-2 bg-white', {
          [styles.hasShadow]: isScrolled,
          [styles.noSearch]: !showSearch,
        })}>
        <div className="relative z-1 flex items-center pb2 pt3 ph3">
          <Link className="inline-flex mb1" to={getLocalizedURL('/', lang)}>
            <img alt="logo" className={styles.logo} src={logo} />
          </Link>
          <div className="mh3 m_dn">
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
              <div className={cx(styles.searchWrapper, 'm_ml4')}>
                <Search className="m_relative" location={location} size="small" />
              </div>
            )}
          </div>
          <div className="flex items-baseline b nowrap">
            <Link
              activeClassName="tp-link--inherit"
              className={cx('tp-link pl3 m_pl5', { 'dn m_db': showSearch })}
              to={getLocalizedURL('/top-ten', lang)}>
              <FormattedMessage id="header_link_top_ten" defaultMessage="Top 10" />
            </Link>
            <Link
              activeClassName="tp-link--inherit"
              className={cx('tp-link pl3 m_pl5', { 'dn m_db': showSearch })}
              to={getLocalizedURL('/about', lang)}>
              <FormattedMessage id="header_link_about" />
            </Link>
            {props.showLangSwitch && (
              <div className="pl3 m_pl5">
                <LangSwitch {...{ lang, location }} truncate />
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
          <Link
            activeClassName="tp-link--inherit"
            className="tp-link"
            to={getLocalizedURL('/top-ten', lang)}>
            <FormattedMessage id="header_link_top_ten" defaultMessage="Top ten" />
          </Link>
          <SignupAction />
          <AddBusinessAction variant="text" />
        </div>
      </header>
    </>
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
