import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { TextButton } from '@cocolist/thumbprint-react';
import { NavigationCloseSmall } from '@thumbtack/thumbprint-icons';
import useLocalStorage from '../lib/useLocalStorage';

function Alert({ intl: { formatMessage }, ...props }) {
  const storageKey = `${props.id}_dismissed`;
  const [isHidden, hide] = useState(true);
  const [storageValue, setStorageValue] = useLocalStorage(storageKey);
  useEffect(() => {
    hide(storageValue);
  }, [storageValue]);
  return (
    <div
      className={cx('relative z-3 tp-alert tp-alert--banner', props.className, {
        dn: isHidden,
      })}>
      <div className="tp-alert__text">{props.children}</div>
      <div className="absolute top0 right1 bottom0 pa2 tp-body-3 white flex items-center">
        <TextButton
          accessibilityLabel={formatMessage({ id: 'dismiss_action_label' })}
          iconLeft={<NavigationCloseSmall />}
          onClick={() => {
            hide(true);
            setStorageValue(true);
          }}
          theme="inherit"
        />
      </div>
    </div>
  );
}

Alert.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default injectIntl(Alert);
