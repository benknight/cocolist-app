import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { tpColorGreen, tpColorPaleGreen300 } from '@cocolist/thumbprint-tokens';
import { InputsStarFilledSmall } from '@thumbtack/thumbprint-icons';
import styles from './Rating.module.scss';

const Dot = ({ className, color, width, style }) => (
  <svg {...{ className, width, height: width, viewBox: '0 0 10 10' }}>
    <circle cx="5" cy="5" r="5" fill={color} />
  </svg>
);

const sizeToPx = {
  small: 7,
  large: 12,
};

const Rating = ({ badgeCount, points, size, theme }) => {
  const width = sizeToPx[size];
  const className = styles[size];
  if (badgeCount > 0) {
    if (badgeCount > 3) {
      return <InputsStarFilledSmall className={cx(styles.star, 'green')} />;
    }
    const dots = [];
    for (let i = 0; i < badgeCount; i++) {
      dots.push(<Dot {...{ className, color: tpColorGreen, key: i, width }} />);
    }
    return dots;
  }
  if (points > 3) {
    return <Dot {...{ className, color: tpColorPaleGreen300, width }} />;
  }
  return null;
};

Rating.propTypes = {
  badgeCount: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
  size: PropTypes.oneOf(['small', 'large']),
};

Rating.defaultProps = {
  size: 'small',
};

export default Rating;
