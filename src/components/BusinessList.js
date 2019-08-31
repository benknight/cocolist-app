import cx from 'classnames';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import React from 'react';
import { Wrap } from '@cocolist/thumbprint-react';
import BusinessRenderData from '../lib/BusinessRenderData';
import { parseLangFromURL } from '../lib/i18n';
import Categories from './Categories';

const BusinessList = ({ businesses, location, maxColumns, title }) => (
  <>
    <Wrap>
      <h1 className="tp-title-1 mv5 l_mv6 w-80 l_w-75 pt4">{title}</h1>
    </Wrap>
    <Wrap bleedBelow="medium">
      <div className="grid grid-wide l_mb6">
        {businesses
          .map(biz => new BusinessRenderData(biz, parseLangFromURL(location.pathname)))
          .map((biz, index) => (
            <div
              className={cx('m_col-6', {
                'l_col-4': maxColumns === 3,
                'l_col-6': maxColumns === 2,
              })}
              key={biz.id}>
              <Link className="db black" to={biz.url}>
                <div className="mb3 m_mb5 pa2 m_pa0">
                  <div className="w-100">
                    <Img
                      alt="logo"
                      className="br2"
                      fluid={biz.thumbnail}
                      objectFit="contain"
                    />
                  </div>
                  <div className="pv2 ph2 m_ph0">
                    <div>
                      <span className="tp-title-6 mr2 dib">{biz.name}</span>
                      <span className="tp-body-2 dib">
                        <Categories categories={biz.categories} limit={2} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </Wrap>
  </>
);

BusinessList.propTypes = {
  businesses: PropTypes.arrayOf(
    PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Profile_photo: PropTypes.object.isRequired,
      Record_ID: PropTypes.string.isRequired,
      URL_key: PropTypes.string.isRequired,
    }),
  ).isRequired,
  location: PropTypes.object.isRequired,
  maxColumns: PropTypes.oneOf([2, 3]),
  title: PropTypes.node.isRequired,
};

BusinessList.defaultProps = {
  maxColumns: 3,
};

export default BusinessList;
