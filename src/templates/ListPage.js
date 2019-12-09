import cx from 'classnames';
import { Link, graphql, navigate } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Wrap } from '@thumbtack/thumbprint-react';
import { NavigationCaretDownSmall } from '@thumbtack/thumbprint-icons';
import Categories from '../components/Categories';
import Header from '../components/Header';
import { badges } from '../lib/Badges.common';
import BusinessRenderData from '../lib/BusinessRenderData';
import { getLocalizedURL, parseLangFromURL } from '../lib/i18n';
import getBusinessesFromSurveyData from '../lib/getBusinessesFromSurveyData';

export const query = graphql`
  query($city: String!) {
    allAirtable(
      filter: {
        table: { eq: "Survey" }
        data: {
          Status: { eq: "Published" }
          Business_record_match: {
            elemMatch: { data: { Record_ID: { ne: null }, Cities: { in: [$city] } } }
          }
        }
      }
      sort: { fields: data___Coco_points, order: DESC }
    ) {
      edges {
        node {
          data {
            ...FBSurveyDataFragment
            Business_record_match {
              data {
                ...BusinessDataFragment
              }
            }
          }
        }
      }
    }
  }
`;

const ListPage = ({
  data,
  intl: { formatMessage },
  location,
  maxColumns,
  title,
  pageContext: { city, langKey, slug },
}) => {
  const badge = badges.find(b => b.linkSlug === slug);
  const businesses = getBusinessesFromSurveyData(
    data.allAirtable.edges.filter(edge => badge.test(edge.node.data)),
  );

  const navOptions = {
    byoc: 'byoc_discount_label',
    'green-delivery': 'green_delivery_label',
    'food-waste': 'food_waste_program_label',
    vegetarian: 'menu_vegetarian_label',
    'green-kitchen': 'green_kitchen_label',
    'no-plastic-bags': 'no_plastic_bags_label',
    'no-plastic-bottles': 'no_plastic_bottles_label',
    'no-plastic-straws': 'no_plastic_straws_label',
    'free-drinking-water': 'refill_my_bottle_label',
    'top-ten': 'top_ten_businesses_heading',
  };

  const nav = (
    <div className="dib relative">
      <select
        className="tp-body-1 absolute top-0 left-0 w-100 h-100"
        defaultValue={slug}
        onChange={event =>
          navigate(
            getLocalizedURL(`/${city.toLowerCase()}/${event.target.value}`, langKey),
          )
        }
        style={{ opacity: 0 }}>
        {Object.keys(navOptions).map(key => (
          <option key={key} value={key}>
            {formatMessage(
              { id: navOptions[key] },
              { city: formatMessage({ id: 'Vietnam' }) },
            )}
          </option>
        ))}
      </select>
      <div className="dib green">
        <span className="underline">
          {formatMessage({ id: navOptions[slug] }).toLowerCase()}
        </span>
        &nbsp;
        <div className="dib ml1">
          <NavigationCaretDownSmall />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>
          {formatMessage(
            { id: 'business_list_heading' },
            {
              city: formatMessage({ id: city }),
              thing: formatMessage({ id: navOptions[slug] }).toLowerCase(),
            },
          )}
        </title>
      </Helmet>
      <Header location={location} />
      <Wrap>
        <h1 className="tp-title-1 mv5 l_mv6 w-80 l_w-75 pt4">
          <FormattedMessage
            id="business_list_heading"
            values={{
              city: formatMessage({ id: city }),
              thing: nav,
            }}
          />
        </h1>
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
};

ListPage.propTypes = {
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

ListPage.defaultProps = {
  maxColumns: 3,
};

export default injectIntl(ListPage);
