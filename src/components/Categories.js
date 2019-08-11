import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const Categories = ({ categories, limit }) =>
  categories.slice(0, limit).map((cat, index) => (
    <React.Fragment key={index}>
      <FormattedMessage id={cat} />
      {index === Math.min(limit, categories.length) - 1 ? '' : ', '}
    </React.Fragment>
  ));

Categories.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  limit: PropTypes.number,
};

Categories.defaultProps = {
  limit: 3,
};

export default Categories;
