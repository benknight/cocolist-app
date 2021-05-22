import { Link, graphql, navigate } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Wrap } from '@thumbtack/thumbprint-react';
import { NavigationCaretDownSmall } from '@thumbtack/thumbprint-icons';
import BusinessCard from '../components/BusinessCard';
import Categories from '../components/Categories';
import Header from '../components/Header';
import { badges } from '../lib/common/Badges';
import getBizPresenter from '../lib/common/getBizPresenter';
import { getLocalizedURL, parseLangFromURL } from '../lib/common/i18n';

export const query = graphql`
  query($city: String!) {
    allAirtable(
      filter: {
        table: { eq: "Survey" }
        data: {
          Status: { eq: "Published" }
          Record_ID: { ne: null }
          Cities: { in: [$city] }
        }
      }
      sort: { fields: data___Coco_points, order: DESC }
    ) {
      edges {
        node {
          data {
            ...BusinessDataFragment
            ...SurveyDataFragment
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
  pageContext: { city, citySlug, langKey, slug },
}) => {
  // TODO: Support non-Badge list pages
  const badge = badges.find(b => b.linkSlug === slug);

  const navOptions = {
    byoc: 'byoc_discount_label',
    'green-delivery': 'green_delivery_label',
    'food-waste': 'food_waste_program_label',
    vegetarian: 'menu_vegetarian_label',
    'no-plastic-bags': 'no_plastic_bags_label',
    'no-plastic-bottles': 'no_plastic_bottles_label',
    'no-plastic-straws': 'no_plastic_straws_label',
    'free-drinking-water': 'refill_my_bottle_label',
  };

  const nav = (
    <div className="dib relative">
      <select
        className="tp-body-1 absolute top-0 left-0 w-100 h-100"
        defaultValue={slug}
        onChange={event =>
          navigate(getLocalizedURL(`/${citySlug}/${event.target.value}`, langKey))
        }
        style={{ opacity: 0 }}>
        {Object.keys(navOptions).map(key => (
          <option key={key} value={key}>
            {formatMessage({ id: navOptions[key] })}
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
        <h1 className="tp-title-1 mv5 l_mv6 m_w-80 l_w-75 pt4">
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
          {data.allAirtable.edges
            .filter(edge => badge.test(edge.node.data))
            .map(edge =>
              getBizPresenter(edge.node.data, parseLangFromURL(location.pathname)),
            )
            .sort((a, b) => {
              if (a.badges.length === b.badges.length) {
                return b.cocoPoints - a.cocoPoints;
              }
              return b.badges.length - a.badges.length;
            })
            .filter(biz => {
              if (!biz.coverPhoto) {
                console.error(`No thumbnail found for ${biz.name}`);
                return false;
              }
              return true;
            })
            .map(biz => (
              <div className="m_col-6 l_col-4" key={biz.url}>
                <Link className="db black" to={biz.url}>
                  <div className="mb3 m_mb5 pa2 m_pa0">
                    <div className="w-100">
                      <BusinessCard biz={biz} />
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

export default injectIntl(ListPage);
