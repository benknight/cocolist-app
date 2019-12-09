import React from 'react';
import { LoaderDots } from '@thumbtack/thumbprint-react';
import styles from './Loader.module.scss';

export default props => (
  <div className={styles.wrapper}>
    <LoaderDots {...props} />
  </div>
);
