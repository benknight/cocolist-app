import cx from 'classnames';
import _get from 'lodash/get';
import { Link, graphql } from 'gatsby';
import Img from 'gatsby-image';
import React from 'react';
import Helmet from 'react-helmet';
import { shuffle } from 'shuffle-seed';
import { FormattedMessage, injectIntl } from 'react-intl';
import OPGPreviewImage from '../assets/og-preview.jpg';
import AddBusinessAction from '../components/AddBusinessAction';
import BusinessCard from '../components/BusinessCard';
import Header from '../components/Header';
import Map from '../components/Map';
import Search from '../components/Search';
import SignupForm from '../components/SignupForm';
import { badges } from '../lib/common/Badges';
import BusinessRenderData from '../lib/common/BusinessRenderData';
import { getLocalizedURL } from '../lib/common/i18n';
import useAuth from '../lib/useAuth';
import styles from './CityPage.module.scss';

export const query = graphql`
  fragment CityPageSurveyFragment on AirtableEdge {
    node {
      data {
        ...FBSurveyDataFragment
        Business_record_match {
          data {
            Name
            URL_key
            Cover_photo {
              localFiles {
                childImageSharp {
                  fluid(maxWidth: 800, maxHeight: 500, cropFocus: CENTER) {
                    ...GatsbyImageSharpFluid_noBase64
                  }
                }
              }
            }
            Profile_photo {
              localFiles {
                childImageSharp {
                  fluid(maxWidth: 200, maxHeight: 200, cropFocus: CENTER) {
                    ...GatsbyImageSharpFluid_noBase64
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  query($city: String!) {
    city: airtable(table: { eq: "Cities" }, data: { Name: { eq: $city } }) {
      data {
        Name
        Map_center
        Map_zoom
        Partners {
          data {
            Name
            Link
            Logo {
              localFiles {
                childImageSharp {
                  fixed(width: 200, height: 200, cropFocus: CENTER) {
                    ...GatsbyImageSharpFixed_noBase64
                  }
                }
              }
            }
          }
        }
      }
    }
    surveys: allAirtable(
      filter: {
        table: { eq: "Survey" }
        data: {
          Business_record_match: {
            elemMatch: { data: { Record_ID: { ne: null }, Cities: { in: [$city] } } }
          }
          Status: { eq: "Published" }
        }
      }
      sort: { fields: [data___Coco_points], order: DESC }
    ) {
      edges {
        ...CityPageSurveyFragment
      }
    }
  }
`;

const CityPage = ({
  data,
  intl: { formatMessage },
  location,
  pageContext: { city, langKey, slug },
}) => {
  const auth = useAuth();
  const title = formatMessage(
    {
      id: 'find_businesses_headline',
    },
    { city: formatMessage({ id: city }) },
  );

  const addBizPromo = (
    <div className="ph4 m_ph6 l_ph7 pv6 bg-gray-200">
      <div className="tp-title-2 mw7">
        <FormattedMessage id="add_business_headline" />
      </div>
      <p className="measure mt3 mb5">
        <FormattedMessage
          id="add_business_description"
          values={{ city: formatMessage({ id: city }) }}
        />
      </p>
      <AddBusinessAction variant="button" />
    </div>
  );

  const pushAddBizPromoToTop = data.surveys.edges.length < 30;
  const partner = _get(data, 'city.data.Partners[0]');

  return (
    <>
      <Helmet>
        <title>{title} - Cocolist</title>
        <meta property="fb:app_id" content="375503033345734" />
        <meta property="og:title" content={`Cocolist – ${formatMessage({ id: city })}`} />
        <meta property="og:image" content={`https://cocolist.app${OPGPreviewImage}`} />
        <meta
          property="og:url"
          content={`https://cocolist.app${getLocalizedURL('/', langKey)}`}
        />
        <meta
          property="og:description"
          content="Find restaurants with plastic-free delivery, discounts for customers who bring their own containers, or free drinking water."
        />
        <meta
          property="twitter:card"
          content={`https://cocolist.app${OPGPreviewImage}`}
        />
      </Helmet>
      <Header location={location} showSearch={false} />
      <div className="relative">
        <Map
          className={styles.mapContainer}
          center={data.city.data.Map_center}
          location={location}
          zoom={data.city.data.Map_zoom}
        />
        <div
          className={cx(
            styles.mapGradientOverlay,
            'relative ph4 l_pr0 m_pl6 m_mr6 l_pl7 l_mr7 pv4 l_pv6 mw8',
          )}>
          <div className="pv4 l_pv6">
            <div className="s_pr6 m_pr0">
              <h1 className="tp-title-1 mb3">
                <FormattedMessage
                  id="find_businesses_headline"
                  values={{ city: formatMessage({ id: data.city.data.Name }) }}
                />
              </h1>
            </div>
            <Search
              city={city}
              className="relative z-1"
              location={location}
              size="large"
            />
            {partner && (
              <div className="flex items-center mt6">
                <a className="tp-link b" href={partner.data.Link}>
                  <Img
                    alt=""
                    className="br2 w4 h4"
                    fixed={_get(partner.data, 'Logo.localFiles[0].childImageSharp.fixed')}
                    objectFit="contain"
                  />
                </a>
                <div className="ml3 tp-body-2">
                  <FormattedMessage
                    id="partnership_with"
                    values={{
                      partner: (
                        <a className="tp-link b nowrap" href={partner.data.Link}>
                          {partner.data.Name}
                        </a>
                      ),
                    }}
                  />
                  <div className="tp-body-3 mt1">
                    <FormattedMessage
                      id="partnership_learn_more"
                      values={{
                        a: (...args) => <Link to="/about#partnerships">{args}</Link>,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {pushAddBizPromoToTop && addBizPromo}
      {badges.map(badge => {
        const surveys = shuffle(
          data.surveys.edges
            .map(({ node: { data: survey } }) => survey)
            .filter(survey => badge.test(survey))
            .filter(survey => {
              return !!_get(
                survey,
                'Business_record_match[0].data.Cover_photo.localFiles[0].childImageSharp.fluid',
              );
            }),
          badge.key + (process.env.GATSBY_BUILD_TIMESTAMP || Date.now()),
        );

        const listPageLink = `/${slug}/${badge.linkSlug}`;

        if (surveys.length === 0) {
          return null;
        }

        return (
          <div
            className="flex flex-column l_flex-row items-center justify-end m_items-start mv4"
            key={badge.key}>
            <div className="l_mw7">
              <div className="m_flex flex-shrink-0 items-center l_justify-end w-100 m_mv5 ph4 m_pl6 l_pr4 l_pl6 tc m_tl">
                <img
                  alt={formatMessage({ id: badge.title })}
                  className={cx(styles.badge, 'flex-shrink-0 mb1 self-start')}
                  src={require(`../assets/badges/${badge.imageLarge}`)}
                  width="110"
                  height="110"
                />
                <div className="m_ml3 l_ml4 m_pr7 l_pr0 m_mw7 flex-auto">
                  <h2 className="tp-title-4">
                    <FormattedMessage id={badge.title} />
                  </h2>
                  <div className="tp-body-1 mt1">
                    <FormattedMessage
                      id={badge.description}
                      values={{
                        business: formatMessage({ id: 'generic_business_name' }),
                        byoc_discount: '',
                      }}
                    />
                    <div className="mt1 tp-body-2">
                      <Link
                        className="tp-link b"
                        to={getLocalizedURL(listPageLink, langKey)}>
                        <FormattedMessage
                          id="see_all_businesses"
                          defaultMessage="See all businesses"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="flex flex-nowrap overflow-auto w-100 l_w-60 ph3 l_ph0"
              style={{ WebkitOverflowScrolling: 'touch' }}>
              {surveys.slice(0, 8).map((survey, index) => {
                return survey.Business_record_match.map(
                  ({ data }) => new BusinessRenderData(data, langKey),
                ).map(biz => (
                  <Link
                    className="db pr2 pv4 w6 flex-shrink-0"
                    key={biz.name}
                    to={biz.url}>
                    <BusinessCard biz={biz} />
                    <div className="tp-body-2 black mt1 mr3">
                      <div className="b">{biz.name}</div>
                    </div>
                  </Link>
                ));
              })}
              {surveys.length > 8 && (
                <div className="pv4 flex-shrink-0 w6 pr1">
                  <div className="aspect-ratio aspect-ratio-8x5">
                    <Link
                      to={listPageLink}
                      className="br2 bg-green aspect-ratio-object flex items-center justify-center">
                      <div className="tp-button tp-button--small tp-button--primary">
                        <FormattedMessage
                          id="view_more_button"
                          defaultMessage="View more"
                        />
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
      {!pushAddBizPromoToTop && addBizPromo}
      {!auth.user && (
        <div
          className={cx('ph4 m_ph6 l_ph7 pv6', { 'bg-gray-200': pushAddBizPromoToTop })}>
          <div className="tp-title-3 mb5 mw7">
            <FormattedMessage id="signup_heading" />
          </div>
          <div className="mw7">
            <SignupForm useProgressiveDisclosure />
          </div>
        </div>
      )}
    </>
  );
};

export default injectIntl(CityPage);
