import { Link } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import React from 'react';
import { Wrap } from '@cocolist/thumbprint-react';
import { getLocalizedURL, parseLangFromURL } from '../lib/i18n';
import Categories from './Categories';

const BusinessList = ({ businesses, location, title }) => (
  <>
    <Wrap>
      <h1 className="tp-title-1 mv5 l_mv6 w-80 l_w-75 pt4">{title}</h1>
    </Wrap>
    <Wrap bleedBelow="medium">
      <div className="grid grid-wide l_mb6">
        {businesses.map((biz, index) => (
          <Link
            to={getLocalizedURL(`/${biz.URL_key}`, parseLangFromURL(location.pathname))}
            className="black m_col-6 l_col-4"
            key={biz.Record_ID}>
            <div className="mb3 m_mb5 pa2 m_pa0">
              <div className="w-100">
                <Img
                  alt="logo"
                  className="br2"
                  fluid={biz.Profile_photo.localFiles[0].childImageSharp.fluid}
                  objectFit="contain"
                />
              </div>
              <div className="pv2 ph2 m_ph0">
                <div>
                  <span className="tp-title-6 mr2 dib">{biz.Name}</span>
                  <span className="tp-body-2 dib">
                    <Categories biz={biz} limit={2} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
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
  title: PropTypes.string.isRequired,
};

export default BusinessList;
