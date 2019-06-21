import { navigate } from 'gatsby';
import _pick from 'lodash/pick';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { LoaderDots } from '@cocolist/thumbprint-react';
import auth from '../lib/auth';

export const AuthContext = React.createContext({});

class AuthProvider extends React.PureComponent {
  state = {
    invalidLink: null,
    isSigningIn: null,
    user: undefined,
  };

  componentDidMount() {
    const {
      intl: { formatMessage },
      location,
    } = this.props;
    this.unsubscribe = auth.onUserUpdated(update =>
      this.setState({ user: { ...this.state.user, ...update } }),
    );
    auth.onAuthStateChanged(user => {
      if (user && !user.disabled) {
        this.setUser(user);
      } else {
        if (!auth.isSignInWithEmailLink(location.href)) {
          this.setState({ user: null });
        }
      }
    });
    if (auth.isSignInWithEmailLink(location.href)) {
      this.setState({ isSigningIn: true });
      const email =
        window.localStorage.getItem('emailForSignIn') ||
        window.prompt(formatMessage({ id: 'signin_confirm_email' }));
      auth
        .signInWithEmailLink(email, location.href)
        .then(result => {
          this.setState({ isSigningIn: false });
          navigate(location.pathname, { replace: true });
        })
        .catch(error => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
          console.error(error.message);
          this.setState({ invalidLink: true, isSigningIn: false, user: null });
        });
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  setUser(userData) {
    this.setState({
      user: _pick(userData, ['accessToken', 'displayName', 'email', 'uid']),
    });
  }

  render() {
    const { invalidLink, isSigningIn, user } = this.state;
    return (
      <AuthContext.Provider value={{ invalidLink, user }}>
        {isSigningIn ? (
          <div className="ph3 pv7 tc">
            <LoaderDots />
            <div className="mt4">
              <FormattedMessage id="signin_in_progress" />
            </div>
          </div>
        ) : (
          this.props.children
        )}
      </AuthContext.Provider>
    );
  }
}

export default injectIntl(AuthProvider);
