import cx from 'classnames';
import { Link, navigate } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { injectIntl } from 'react-intl';
import { Wrap } from '@cocolist/thumbprint-react';
import { NavigationCaretDownSmall } from '@thumbtack/thumbprint-icons';
import BusinessRenderData from '../lib/BusinessRenderData';
import { getLocalizedURL, parseLangFromURL } from '../lib/i18n';
import Categories from './Categories';

const LocationContext = React.createContext(null);

export const BusinessListSelector = injectIntl(
  ({ children, intl: { formatMessage }, selected }) => {
    const location = useContext(LocationContext);
    const lang = parseLangFromURL(location.pathname);
    const options = {
      byoc: 'byoc_discount_label',
      'green-delivery': 'green_delivery_label',
      'food-waste': 'food_waste_program_label',
      'green-kitchen': 'green_kitchen_label',
      'no-plastic-bags': 'no_plastic_bags_label',
      'no-plastic-bottles': 'no_plastic_bottles_label',
      'no-plastic-straws': 'no_plastic_straws_label',
      'free-drinking-water': 'refill_my_bottle_label',
      'top-ten': 'top_ten_businesses_heading',
    };
    return (
      <div className="dib relative">
        <select
          className="tp-body-1 absolute top-0 left-0 w-100 h-100"
          onChange={event => navigate(getLocalizedURL(`/${event.target.value}`, lang))}
          style={{ opacity: 0 }}>
          {Object.keys(options).map(key => (
            <option key={key} selected={key === selected} value={key}>
              {formatMessage(
                { id: options[key] },
                { city: formatMessage({ id: 'Saigon' }) },
              )}
            </option>
          ))}
        </select>
        <div className="dib green">
          <span className="underline">
            {formatMessage({ id: options[selected] }).toLowerCase()}
          </span>
          &nbsp;
          <div class="dib ml1">
            <NavigationCaretDownSmall />
          </div>
        </div>
      </div>
    );
  },
);

const BusinessList = ({ businesses, location, maxColumns, title }) => (
  <LocationContext.Provider value={location}>
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
  </LocationContext.Provider>
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
