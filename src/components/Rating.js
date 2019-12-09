import PropTypes from 'prop-types';
import React from 'react';
import { tpColorGray300, tpColorPaleGreen300 } from '@thumbtack/thumbprint-tokens';
import { InputsStarFilledSmall, InputsStarFilledTiny } from '@thumbtack/thumbprint-icons';
import styles from './Rating.module.scss';

// TODO: Switch to using utility classes with inherit instead of importing JS colors

export const Dot = ({ className, color, width, style }) => (
  <svg {...{ className, width, height: width, viewBox: '0 0 10 10' }}>
    <circle cx="5" cy="5" r="5" fill={color} />
  </svg>
);

const sizeToPx = {
  small: 8,
  large: 12,
};

const Rating = ({ badgeCount, points, size, theme }) => {
  const width = sizeToPx[size];
  const className = styles[size];
  const Icon = size === 'small' ? InputsStarFilledTiny : InputsStarFilledSmall;
  if (badgeCount > 0) {
    const dots = [];
    for (let i = 0; i < Math.min(badgeCount, 5); i++) {
      // dots.push(<Dot {...{ className, color: tpColorGreen, key: i, width }} />);
      dots.push(<Icon className="green" key={i} />);
    }
    return <div className="dib nowrap">{dots}</div>;
  }
  if (points > 3) {
    return <Dot {...{ className, color: tpColorPaleGreen300, width }} />;
  }
  return <Dot {...{ className, color: tpColorGray300, width }} />;
};

Rating.propTypes = {
  badgeCount: PropTypes.number,
  points: PropTypes.number,
  size: PropTypes.oneOf(['small', 'large']),
};

Rating.defaultProps = {
  badgeCount: 0,
  points: 0,
  size: 'small',
};

export default Rating;
