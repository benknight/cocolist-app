import _pick from 'lodash/pick';
import PropTypes from 'prop-types';
import React from 'react';
import logo from '../assets/logo.svg';

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
          callbacks: {
            signInSuccessWithAuthResult: authResult => {
              return false;
            },
          },
          signInOptions: [
            {
              provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
              signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
            },
          ],
        });
      }
      if (user && !user.disabled && !firebaseauthui.isPendingRedirect()) {
        this.setState({
          user: _pick(user, ['accessToken', 'displayName', 'email', 'uid']),
        });
      } else {
        this.setState({ user: null });
      }
    });
  }

  render() {
    const { className, children, isPrivate } = this.props;

    let content = null;

    if (isPrivate && !this.state.user) {
      if (this.state.user === null) {
        content = (
          <div className="tc mv4 s_mt7">
            <img
              alt=""
              className="ma0"
              src={logo}
              style={{ width: '4rem', height: 'auto' }}
            />
          </div>
        );
      }
    } else {
      content = (
        <UserContext.Provider value={this.state.user}>
          <div className={className}>{children}</div>
        </UserContext.Provider>
      );
    }

    return content;
  }
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isPrivate: PropTypes.bool,
  location: PropTypes.object.isRequired,
};

export default Page;