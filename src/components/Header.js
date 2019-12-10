import cx from 'classnames';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { TextButton } from '@thumbtack/thumbprint-react';
import {
  NavigationCaretDownTiny,
  NavigationCaretUpTiny,
} from '@thumbtack/thumbprint-icons';
import logo from '../assets/logo.svg';
import { getLocalizedURL, parseLangFromURL } from '../lib/i18n';
import useLocalStorage from '../lib/useLocalStorage';
import AddBusinessAction from './AddBusinessAction';
import Search from './Search';
import SignupAction from './SignupAction';
import styles from './Header.module.scss';

const LangSwitch = props => {
  const [, setLangSelection] = useLocalStorage('langSelection');
  return (
    <div
      className={cx(
        styles.lang,
        { [styles.truncate]: props.truncate },
        'dib br1 pv1 ph2',
        // 'bg-gray-300',
      )}>
      {props.lang === 'en' ? (
        <Link
          onClick={() => setLangSelection('vi')}
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
          onClick={() => setLangSelection('en')}
          to={getLocalizedURL(props.location.pathname, 'en')}
          title="Switch to English">
          <span className={styles.langLong}>English</span>
          <span className={styles.langShort}>EN</span>
        </Link>
      )}
    </div>
  );
};

const Header = ({ location, showSearch, ...props }) => {
  const lang = parseLangFromURL(location.pathname);
  const [isScrolled, setScrolled] = useState(false);
  const [isNavExpanded, setNavExpanded] = useState(false);
  const [citySelection] = useLocalStorage('citySelection');
  const homeLink = getLocalizedURL(`/${(citySelection || '').toLowerCase()}`, lang);
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
      <header
        className={cx(styles.container, 'z-2 bg-white', {
          [styles.hasShadow]: isScrolled,
          [styles.noSearch]: !showSearch,
        })}>
        <div className="relative z-1 flex items-center pb2 pt3 ph3">
          <Link
            className="inline-flex mb1 pr3"
            onClick={event => {
              setNavExpanded(!isNavExpanded);
              event.preventDefault();
            }}
            to={homeLink}>
            <img alt="logo" className={styles.logo} src={logo} />
          </Link>
          <div className="mr3">
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
            <div className={cx('ml3 m_ml4 l_ml5', { 'dn m_db': showSearch })}>
              <AddBusinessAction variant="text" />
            </div>
            <div className={cx('ml3 m_ml4 l_ml5', { 'dn m_db': showSearch })}>
              <Link
                activeClassName="tp-link--inherit"
                className="tp-link"
                to={getLocalizedURL('/about', lang)}>
                <FormattedMessage id="header_link_about" />
              </Link>
            </div>
            {props.showLangSwitch && (
              <div className="ml3 m_ml4 l_ml5">
                <LangSwitch {...{ lang, location }} truncate />
              </div>
            )}
          </div>
        </div>
        <div className={cx(styles.nav, 'bg-white pa3 z-0 b', { dn: !isNavExpanded })}>
          <Link className="tp-link" to={homeLink}>
            <FormattedMessage id="header_link_home" />
          </Link>
          <Link
            activeClassName="tp-link--inherit"
            className="tp-link"
            to={getLocalizedURL('/about', lang)}>
            <FormattedMessage id="header_link_about" />
          </Link>
          <AddBusinessAction variant="text" />
          <SignupAction />
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
