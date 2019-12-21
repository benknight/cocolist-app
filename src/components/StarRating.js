import cx from 'classnames';
import React from 'react';
import { StarRating as TPStarRating } from '@thumbtack/thumbprint-react';
import styles from './StarRating.module.scss';

const StarRating = props => {
  return (
    <div className={cx(styles.wrapper, 'inline-flex')}>
      <TPStarRating {...props} />
    </div>
  );
};

export default StarRating;
