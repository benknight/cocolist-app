import React from 'react';
import { Button } from '@thumbtack/thumbprint-react';
import styles from './Button.module.scss';

export default props => (
  <div className={styles.wrapper}>
    <Button {...props} />
  </div>
);
