import cx from 'classnames';
import { graphql, StaticQuery } from 'gatsby';
import _pick from 'lodash/pick';
import PropTypes from 'prop-types';
import React from 'react';
import Helmet from 'react-helmet';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import vi from 'react-intl/locale-data/vi';
import logo from '../assets/logo.svg';
import { parseLocaleFromURL } from '../lib/i18n';

addLocaleData([...en, ...vi]);

const UserContext = React.createContext();

class Page extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    // const { isPrivate } = this.props;
    // const { firebase, firebaseui, firebaseauthui } = window;
    // if (!firebase || !firebase.auth || !firebaseui || !firebaseauthui) {
    //   throw new Error('Required Firebase SDKs missing.');
    // }
    // firebase.auth().onAuthStateChanged(user => {
    //   if ((isPrivate && user === null) || firebaseauthui.isPendingRedirect()) {
    //     firebaseauthui.start('#firebaseui-auth-container', {
    //       signInOptions: [
    //         {
    //           provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //           requireDisplayName: true,
    //           signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
    //         },
    //       ],
    //     });
    //   }
    //   if (user) {
    //     this.setState({
    //       user: _pick(user, ['accessToken', 'displayName', 'email', 'uid']),
    //     });
    //   }
    // });
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
          <div className={className}>{children}</div>
        </UserContext.Provider>
      );
    }

    return (
      <StaticQuery
        query={graphql`
          {
            allAirtable(filter: { table: { eq: "Translations" } }) {
              edges {
                node {
                  data {
                    Key
                    en
                    vi
                  }
                }
              }
            }
          }
        `}
        render={({ allAirtable: { edges } }) => {
          const locale = parseLocaleFromURL(location.pathname);
          const messages = edges.reduce((values, currentValue) => {
            const {
              node: { data },
            } = currentValue;
            values[data.Key] = data[locale];
            return values;
          }, {});
          return (
            <IntlProvider locale={locale} messages={messages}>
              <>
                <Helmet htmlAttributes={{ lang: locale }} />
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
