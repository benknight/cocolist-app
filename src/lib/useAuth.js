import { navigate } from 'gatsby';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Firebase from './Firebase';
import useLocalStorage from './useLocalStorage';
import createHubspotContact from './createHubspotContact';

const auth = Firebase.auth();

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default () => {
  return useContext(AuthContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [isBusy, setBusy] = useState(true);
  const [invalidLink, setInvalidLink] = useState(false);
  const [signInEmail, setSignInEmail] = useLocalStorage('signInEmail');
  const intl = useIntl();

  const signIn = async (email, returnTo = window.location.href) => {
    setInvalidLink(false);
    await auth.sendSignInLinkToEmail(email, {
      handleCodeInApp: true,
      url: returnTo,
    });
    setSignInEmail(email);
  };

  const signUp = async (
    email,
    password = Math.random()
      .toString(36)
      .slice(-8),
  ) => {
    const { user } = await auth.createUserWithEmailAndPassword(email, password);
    setUser(user);
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(false);
  };

  const updateUser = async data => {
    await auth.currentUser.updateProfile(data);
    setUser({ ...auth.currentUser });
  };

  const saveProfile = async data => {
    if (!user) {
      await signUp(data.email);
    }
    return Promise.all([
      updateUser({ displayName: data.firstName }),
      createHubspotContact(data),
    ]);
  };

  // const sendPasswordResetEmail = email => {
  //   return auth
  //     .sendPasswordResetEmail(email)
  //     .then(() => {
  //       return true;
  //     });
  // };

  // const confirmPasswordReset = (code, password) => {
  //   return auth
  //     .confirmPasswordReset(code, password)
  //     .then(() => {
  //       return true;
  //     });
  // };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
      if (!auth.isSignInWithEmailLink(window.location.href)) {
        setBusy(false);
      }
    });
    if (auth.isSignInWithEmailLink(window.location.href)) {
      setBusy(true);
      const email =
        signInEmail || window.prompt(intl.formatMessage({ id: 'signin_confirm_email' }));
      auth
        .signInWithEmailLink(email, window.location.href)
        .then(result => {
          navigate(`${window.location.pathname}${window.location.hash}`, {
            replace: true,
          });
          setBusy(false);
        })
        .catch(error => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
          console.error(error.message);
          setInvalidLink(true);
          setUser(null);
          setBusy(false);
        });
    }

    return () => unsubscribe();
  }, [intl, signInEmail]);

  return {
    invalidLink,
    isBusy,
    saveProfile,
    signIn,
    signOut,
    signUp,
    updateUser,
    user,
  };
}
