import cx from 'classnames';
import { Link, navigate } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { TextButton, Tooltip } from '@thumbtack/thumbprint-react';
import {
  NavigationCaretDownTiny,
  NavigationCaretUpTiny,
  ContentModifierMapPinSmall,
} from '@thumbtack/thumbprint-icons';
import logo from '../assets/logo.svg';
import { getLocalizedURL, parseLangFromURL } from '../lib/common/i18n';
import useAuth from '../lib/useAuth';
import useBreakpoint from '../lib/useBreakpoint';
import useCitySelection from '../lib/useCitySelection';
import AddBusinessAction from './AddBusinessAction';
import LangSwitch from './LangSwitch';
import Search from './Search';
import SignupAction from './SignupAction';
import styles from './Header.module.scss';

const Header = ({ location, showSearch, ...props }) => {
  const auth = useAuth();
  const breakpoint = useBreakpoint();
  const [selectedCity] = useCitySelection();
  const { formatMessage } = useIntl();
  const lang = parseLangFromURL(location.pathname);
  const [isScrolled, setScrolled] = useState(false);
  const [isNavExpanded, setNavExpanded] = useState(false);

  // URLs
  const indexURL = getLocalizedURL('/', lang);
  const cambodiaLandingURL = getLocalizedURL('/cambodia', lang);
  const homeURL = selectedCity
    ? getLocalizedURL(`/${selectedCity.slug}`, lang)
    : indexURL;
  const feedbackMailto = `mailto:feedback@cocolist.app?subject=${formatMessage({
    id: 'header_link_feedback',
  })}`;

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
        <div className="relative z-1 flex items-center">
          <Link
            className="inline-flex mb1 pr2"
            onClick={event => {
              if (breakpoint !== 'large') {
                setNavExpanded(!isNavExpanded);
                event.preventDefault();
              }
            }}
            to={homeURL}>
            <img alt="logo" className={styles.logo} src={logo} />
          </Link>

          <div className="m_dn l_dn inline-flex">
            <TextButton
              accessibilityLabel="Open Cocolist navigation"
              iconLeft={
                isNavExpanded ? <NavigationCaretUpTiny /> : <NavigationCaretDownTiny />
              }
              onClick={() => setNavExpanded(!isNavExpanded)}
              theme="inherit"
            />
          </div>

          {showSearch && (
            <div className="ml2 m_ml3 l_w-33">
              <div className={styles.searchWrapper}>
                <Search className="m_relative" location={location} size="small" />
              </div>
            </div>
          )}
          <div className="mh2 s_mh3 nowrap">
            {![indexURL, cambodiaLandingURL].includes(location.pathname) && (
              <Tooltip text={formatMessage({ id: 'change_location_label' })} zIndex={2}>
                {({ onClick, ...tooltipProps }) => (
                  <TextButton
                    {...tooltipProps}
                    iconLeft={<ContentModifierMapPinSmall />}
                    onClick={() => {
                      navigate(indexURL);
                      onClick();
                    }}>
                    {selectedCity ? (
                      <FormattedMessage id={selectedCity.name} />
                    ) : (
                      <FormattedMessage id="change_location_label" />
                    )}
                  </TextButton>
                )}
              </Tooltip>
            )}
          </div>
          <div className="flex flex-auto justify-end items-center b nowrap">
            <div className="dn ml3 m_ml4 l_ml5 m_db">
              <AddBusinessAction variant="text" />
            </div>
            <div className="dn m_db ml3 m_ml4 l_ml5">
              <a className="tp-link" href={feedbackMailto}>
                <FormattedMessage id="header_link_feedback" />
              </a>
            </div>
            <div className="dn m_db ml3 m_ml4 l_ml5">
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
          <Link to={homeURL}>
            <FormattedMessage id="header_link_home" />
          </Link>
          <a className="tp-link" href={feedbackMailto}>
            <FormattedMessage id="header_link_feedback" />
          </a>
          <Link
            activeClassName="tp-link--inherit"
            className="tp-link"
            to={getLocalizedURL('/about', lang)}>
            <FormattedMessage id="header_link_about" />
          </Link>
          <AddBusinessAction variant="text" />
          {auth.user === false && <SignupAction />}
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
