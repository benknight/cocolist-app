import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const Categories = ({ biz, limit }) =>
  biz.Category.map(cat => cat.data.Name)
    .slice(0, limit)
    .map((cat, index) => (
      <React.Fragment key={index}>
        <FormattedMessage id={cat} />
        {index === Math.min(limit, biz.Category.length) - 1 ? '' : ', '}
      </React.Fragment>
    ));

Categories.propTypes = {
  biz: PropTypes.shape({
    Categories: PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.shape({
          Name: PropTypes.string.isRequired,
        }).isRequired,
      }),
    ),
  }),
  limit: PropTypes.number,
};

Categories.defaultProps = {
  limit: 3,
};

export default Categories;
