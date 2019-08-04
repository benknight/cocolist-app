import { Link } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import React from 'react';
import { Wrap } from '@cocolist/thumbprint-react';
import Categories from './Categories';

const BusinessList = props => (
  <>
    <Wrap>
      <h1 className="tp-title-1 mv5 l_mv6 l_w-66 pt4">{props.title}</h1>
    </Wrap>
    <Wrap bleedBelow="medium">
      <div className="grid grid-wide">
        {props.businesses.map((biz, index) => (
          <Link to={biz.URL_key} className="black m_col-6 l_col-4" key={biz.Record_ID}>
            <div className="mb3 pa2 m_pa0">
              <div className="w-100">
                <Img
                  alt="logo"
                  className="br1"
                  fluid={biz.Profile_photo.localFiles[0].childImageSharp.fluid}
                  objectFit="contain"
                />
              </div>
              <div className="pv2 ph2 m_ph0">
                <div>
                  <span className="tp-title-6 mr2 dib">
                    <span className="gray">#{index + 1} </span>
                    {biz.Name}
                  </span>
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
  title: PropTypes.string.isRequired,
};

export default BusinessList;
