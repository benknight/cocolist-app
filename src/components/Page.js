import cx from 'classnames';
import { graphql, StaticQuery } from 'gatsby';
import _pick from 'lodash/pick';
import PropTypes from 'prop-types';
import { getCurrentLangKey } from 'ptz-i18n';
import React from 'react';
import Helmet from 'react-helmet';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import vi from 'react-intl/locale-data/vi';
import logo from '../assets/logo.svg';
import styles from './Page.module.css';

addLocaleData([...en, ...vi]);

const UserContext = React.createContext();

class Page extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const { isPrivate } = this.props;
    const { firebase, firebaseui, firebaseauthui } = window;
    if (!firebase || !firebase.auth || !firebaseui || !firebaseauthui) {
      throw new Error('Required Firebase SDKs missing.');
    }
    firebase.auth().onAuthStateChanged(user => {
      if ((isPrivate && user === null) || firebaseauthui.isPendingRedirect()) {
        firebaseauthui.start('#firebaseui-auth-container', {
          signInOptions: [
            {
              provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
              requireDisplayName: true,
              signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
            },
          ],
        });
      }
      if (user) {
        this.setState({
          user: _pick(user, ['accessToken', 'displayName', 'email', 'uid']),
        });
      }
    });
  }

  render() {
    const { children, className, isPrivate, location } = this.props;

    let content;

    if (isPrivate && !this.state.user) {
      content = (
        <div className="tc mv4">
          <img
            alt=""
            className="ma0"
            src={logo}
            style={{ width: '4rem', height: 'auto' }}
          />
        </div>
      );
    } else {
      content = (
        <UserContext.Provider value={this.state.user}>
          <div className={cx(styles.container, className)}>{children}</div>
        </UserContext.Provider>
      );
    }

    return (
      <StaticQuery
        query={graphql`
          {
            allAirtable(filter: { table: { eq: "Strings" } }) {
              edges {
                node {
                  data {
                    en
                    vi
                  }
                }
              }
            }
          }
        `}
        render={data => {
          const langKey = getCurrentLangKey(['en', 'vi'], 'en', location.pathname);
          const messages = data.allAirtable.edges.reduce((values, currentValue) => {
            values[currentValue.node.data.en] = currentValue.node.data[langKey];
            return values;
          }, {});
          return (
            <IntlProvider locale={langKey} messages={messages}>
              <>
                <Helmet htmlAttributes={{ lang: langKey }} />
                {content}
              </>
            </IntlProvider>
          );
        }}
      />
    );
  }
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isPrivate: PropTypes.bool,
  location: PropTypes.object.isRequired,
};

export default Page;
