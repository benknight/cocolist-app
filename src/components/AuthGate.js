import cx from 'classnames';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import auth from '../lib/auth';
import { AuthContext } from './AuthProvider';
import EditProfile from './EditProfile';
import Login from './Login';
import styles from './AuthGate.module.scss';

function AuthGate(props) {
  const { children } = props;
  const { invalidLink, user } = useContext(AuthContext);

  let content = null;

  if (user && !_get(user, 'displayName')) {
    content = <EditProfile />;
  } else if (!user) {
    if (user !== null) {
      return null;
    } else {
      content = <Login invalidLink={invalidLink} onSubmit={data => auth.login(data)} />;
    }
  } else {
    return children || null;
  }

  return (
    <div className="mt4 m_mt7">
      <div className={cx(styles.panel, 'pa3 m_pa4 m_mw7 center')}>{content}</div>
    </div>
  );
}

AuthGate.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthGate;
