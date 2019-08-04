import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const Categories = ({ biz, limit }) =>
  biz.Category.map(cat => cat.data.Name)
    .map((cat, index) => (
      <React.Fragment key={index}>
        <FormattedMessage id={cat} />
        {index === biz.Category.length - 1 ? '' : ', '}
      </React.Fragment>
    ))
    .slice(0, limit);

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
