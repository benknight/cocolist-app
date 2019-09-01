import _get from 'lodash/get';
import { Link, graphql } from 'gatsby';
import Img from 'gatsby-image';
import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { shuffle } from 'shuffle-seed';
import { Button } from '@cocolist/thumbprint-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import OPGPreviewImage from '../assets/og-preview.jpg';
import AirtableFormModal from '../components/AirtableFormModal';
import Header from '../components/Header';
import Search from '../components/Search';
import Signup from '../components/Signup';
import { badges } from '../lib/badges';
import BusinessRenderData from '../lib/BusinessRenderData';
import { getLocalizedURL } from '../lib/i18n';

const Index = ({ data, intl: { formatMessage }, location, pageContext: { langKey } }) => {
  const [showAddBusinessModal, toggleAddBusinessModal] = useState(false);
  const pageTitle = formatMessage(
    {
      id: 'find_businesses_headline',
    },
    { city: formatMessage({ id: 'Saigon' }) },
  );
  return (
    <>
      <Helmet>
        <title>Cocolist &ndash; {pageTitle}</title>
        <meta property="fb:app_id" content="375503033345734" />
        <meta property="og:title" content={`Cocolist – ${pageTitle}`} />
        <meta property="og:image" content={`https://cocolist.vn${OPGPreviewImage}`} />
        <meta
          property="og:url"
          content={`https://cocolist.vn${getLocalizedURL('/', langKey)}`}
        />
        <meta
          property="og:description"
          content="Find restaurants in Saigon with plastic-free delivery, discounts for customers who bring their own containers, or free drinking water."
        />
        <meta property="twitter:card" content={`https://cocolist.vn${OPGPreviewImage}`} />
      </Helmet>
      <Header location={location} showSearch={false} />
      <div className="pv6 mv2 ph3 m_mv5 m_ph6 m_pv7 l_ph7 mw9">
        <div className="s_pr6 m_pr0 mw7">
          <h1 className="tp-title-1 mb3">
            <FormattedMessage
              id="find_businesses_headline"
              values={{ city: formatMessage({ id: 'Saigon' }) }}
            />
          </h1>
        </div>
        <Search className="relative z-1" location={location} size="large" />
      </div>
      {badges.map(badge => (
        <div
          className="flex flex-column l_flex-row items-center justify-end m_items-start mb4 m_mb6"
          key={badge.key}>
          <div className="l_mw7">
            <div className="m_flex items-center l_justify-end w-100 m_mv5 ph4 m_pl6 l_pr4 l_pl5 tc m_tl">
              <img
                alt={formatMessage({ id: badge.title })}
                src={require(`../assets/badges/${badge.imageLargeAlt}`)}
              />
              <div className="m_ml3 m_pr7 l_pr0 m_mw7 flex-auto">
                <h2 className="tp-title-4">
                  <FormattedMessage id={badge.title} />
                </h2>
                <div className="tp-body-1 mt1">
                  <FormattedMessage
                    id={badge.description}
                    values={{
                      business: formatMessage({ id: 'generic_business_name' }),
                      byoc_percent: '',
                    }}
                  />
                  <div className="mt1 tp-body-2">
                    <Link
                      className="tp-link b"
                      to={getLocalizedURL(badge.linkTarget, langKey)}>
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
            {shuffle(
              data.surveys.edges
                .map(({ node: { data: survey } }) => survey)
                .filter(survey => badge.test(survey))
                .filter(survey => {
                  return !!_get(
                    survey,
                    'Business_record_match[0].data.Profile_photo.localFiles[0].childImageSharp.fluid',
                  );
                }),
              process.env.GATSBY_BUILD_TIMESTAMP || Date.now(),
            )
              .slice(0, 8)
              .map((survey, index) => {
                return survey.Business_record_match.map(
                  ({ data }) => new BusinessRenderData(data, langKey),
                ).map(biz => (
                  <Link
                    className="db pr1 pv4 w6 flex-shrink-0"
                    key={biz.name}
                    to={biz.url}>
                    {biz.thumbnail && (
                      <Img
                        alt="business logo"
                        className="br2 overflow-hidden"
                        fluid={biz.thumbnail}
                        objectFit="contain"
                      />
                    )}
                    <div className="tp-body-2 black mt1">
                      <div className="b">{biz.name}</div>
                    </div>
                  </Link>
                ));
              })}
            <div className="pv4 flex-shrink-0 w6 pr1">
              <div className="aspect-ratio aspect-ratio-8x5">
                <Link
                  to={getLocalizedURL(badge.linkTarget, langKey)}
                  className="br2 bg-green aspect-ratio-object flex items-center justify-center">
                  <div className="tp-button tp-button--small tp-button--primary">
                    <FormattedMessage id="view_more_button" defaultMessage="View more" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="ph4 m_ph6 l_ph7 pv6 bg-gray-200">
        <div className="tp-title-2 mb5 mw7">
          <FormattedMessage id="add_business_headline" />
        </div>
        <Button onClick={() => toggleAddBusinessModal(true)}>
          <FormattedMessage id="add_business_button_label" />
        </Button>
      </div>
      <div className="ph4 m_ph6 l_ph7 pv6 bg-gray-300">
        <div className="tp-title-2 mb5 mw7">
          <FormattedMessage id="signup_heading" />
        </div>
        <div className="mw7">
          <Signup />
        </div>
      </div>
      <AirtableFormModal
        formId="shrw4zfDcry512acj"
        isOpen={showAddBusinessModal}
        onCloseClick={() => toggleAddBusinessModal(false)}
      />
    </>
  );
};

export const query = graphql`
  fragment HomepageSurveyFragment on AirtableEdge {
    node {
      data {
        ...SurveyDataFragment
        Business_record_match {
          data {
            Name
            VNMM_rating_count
            URL_key
            Profile_photo {
              localFiles {
                childImageSharp {
                  fluid(maxWidth: 400, maxHeight: 250) {
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
  query {
    surveys: allAirtable(
      filter: {
        table: { eq: "Food & Beverage Survey" }
        data: {
          Business_record_match: { elemMatch: { data: { Record_ID: { ne: null } } } }
        }
      }
      sort: {
        fields: [
          data___Coco_points
          data___Business_record_match___data___VNMM_rating_count
        ]
        order: DESC
      }
    ) {
      edges {
        ...HomepageSurveyFragment
      }
    }
  }
`;

export default injectIntl(Index);
