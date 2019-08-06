import _get from 'lodash/get';
import React, { useContext, useEffect } from 'react';
import { navigate } from 'gatsby';
import AuthGate from '../components/AuthGate';
import { AuthContext } from '../components/AuthProvider';
import Header from '../components/Header';

const Signup = props => {
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (_get(user, 'displayName')) {
      navigate('/', { replace: true });
    }
  });
  return (
    <>
      <Header location={props.location} />
      <AuthGate />
    </>
  );
};

export default Signup;
