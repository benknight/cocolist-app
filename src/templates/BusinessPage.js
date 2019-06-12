import cx from 'classnames';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import _get from 'lodash/get';
import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  ContentActionsFlagSmall,
  ContentModifierMapPinSmall,
  ContentModifierListSmall,
  NotificationAlertsWarningMedium,
} from '@thumbtack/thumbprint-icons';
import { Link as TPLink, Wrap } from '@cocolist/thumbprint-react';
import fresh from '../assets/fresh.svg';
import EditBusinessButton from '../components/EditBusinessButton';
import Header from '../components/Header';
import Page from '../components/Page';
import Rating from '../components/Rating';
import SurveyView from '../components/SurveyView';
import { getBadgesFromSurvey } from '../lib/badges';
import styles from './BusinessPage.module.scss';

const BusinessPage = props => {
  const {
    data: {
      airtable: { data: biz },
    },
    intl: { formatMessage },
  } = props;

  const thumbnail = _get(biz, 'Photos.localFiles[0].childImageSharp.fluid');

  const survey = (biz.F_B_Survey || [])
    .map(({ data }) => data)
    .find(({ Status }) => Status === 'Published');

  const cats = biz.Category.sort((a, b) => {
    return a.data.Businesses.length - b.data.Businesses.length;
  })
    .map(cat => cat.data.Name)
    .slice(0, 3);

  const bizBadges = survey ? getBadgesFromSurvey(survey) : [];

  const links = [];

  ['Google_Maps_Link', 'Facebook_Link', 'VNMM_Link'].forEach(link => {
    if (biz[link] && biz[link].length > 0) {
      links.push([link, biz[link].split(',')[0].trim()]);
    }
  });

  return (
    <Page {...props}>
      <Helmet>
        <title>
          {biz.Name} &ndash;{' '}
          {formatMessage(
            {
              id: 'eco_friendly_biz_in_vn',
            },
            { city: formatMessage({ id: 'Saigon' }) },
          )}
        </title>
      </Helmet>

      <Header location={props.location} />

      <div className="m_pv4 l_pv6">
        <Wrap bleedBelow="medium">
          <div className="m_flex justify-between items-center mb5">
            <div className={cx(styles.sidebar, 'flex-shrink-0 order-1 self-end')}>
              {thumbnail && (
                <div className={styles.thumbnailWrapper}>
                  <Img alt="logo" fluid={thumbnail} objectFit="contain" />
                </div>
              )}
            </div>
            <div className="ph3 s_ph5 m_ph0 order-0">
              <h1 className="tp-title-1 mb2 mt3 l_mt0">
                <>
                  {bizBadges.length > 3 && (
                    <img
                      alt="Fresh"
                      className={cx(styles.fresh, 'm_mh4 l_mr6 h4')}
                      src={fresh}
                    />
                  )}
                  {biz.Name}{' '}
                  <Rating
                    badgeCount={bizBadges.length}
                    points={survey && survey.Coco_Points}
                    size="large"
                  />
                </>
              </h1>
              <div className="tp-body-2">
                <div className="flex items-start">
                  <ContentModifierListSmall className="w1 mr2" />
                  <div>
                    {cats.map((cat, index) => (
                      <React.Fragment key={index}>
                        <FormattedMessage id={cat} />
                        {index === cats.length - 1 ? '' : ', '}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="flex items-center mv1">
                  <ContentModifierMapPinSmall className="w1 mr2" />
                  <div>
                    {biz.Neighborhood.map(({ data }, index) => (
                      <React.Fragment key={index}>
                        <FormattedMessage id={data.Name} />
                        {index === biz.Neighborhood.length - 1 ? '' : ', '}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              {links.length > 0 && (
                <div className="tp-body-2 flex items-center mv1">
                  <ContentActionsFlagSmall className="w1 mr2" />
                  <div>
                    {links.map(([link, url], index) => (
                      <div key={link} className="dib mr1">
                        <TPLink to={url} theme="inherit" shouldOpenInNewTab>
                          <FormattedMessage id={link.toLowerCase()} />
                        </TPLink>
                        {index !== links.length - 1 && ', '}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="tp-body-2 mv1">
                <EditBusinessButton survey={survey} />
              </div>
            </div>
          </div>
        </Wrap>

        {!survey && (
          <Wrap bleedBelow="medium">
            <div className="lh-copy bg-gray-200 pa4 tc mt4 flex flex-column items-center">
              <NotificationAlertsWarningMedium />
              <h3 className="tp-title-4 mt3 mb2">
                <FormattedMessage id="business_no_data_title" />
              </h3>
              <p className="tp-body-2 mb3 mw7">
                <FormattedMessage
                  id="business_no_data_description"
                  values={{ business: biz.Name }}
                />
              </p>
              <EditBusinessButton survey={survey} theme="button" />
            </div>
          </Wrap>
        )}

        <Wrap>
          {bizBadges.length > 0 ? (
            // Some badges
            <div className="m_flex">
              <div className="flex-auto m_pr6">
                <div className="mv4 m_mt0 m_mb5 m_pb5 l_flex flex-wrap">
                  {bizBadges.map(badge => (
                    <div
                      key={badge.key}
                      className="flex items-center pv3 l_w-50 l_flex-column l_items-start">
                      <div
                        className={cx(
                          styles.badgeImage,
                          'self-start flex-shrink-0 mr3 l_mb3',
                        )}>
                        <img
                          alt=""
                          className="dib l_dn w-100"
                          src={require(`../assets/badges/${badge.imageSmall}`)}
                        />
                        <img
                          alt=""
                          className="dn l_dib w-100"
                          src={require(`../assets/badges/${badge.imageLarge}`)}
                        />
                      </div>
                      <div>
                        <div className="tp-title-5 l_mb1" size={5}>
                          <FormattedMessage id={badge.title} />
                        </div>
                        {badge.description && (
                          <div className="tp-body-2 measure l_pr6">
                            <FormattedMessage
                              id={badge.description}
                              values={{ business: biz.Name }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {biz.From_the_Business && (
                  <div className="mb5">
                    <div className="tp-title-4 mb3">
                      <FormattedMessage id="from_the_business_heading" />
                    </div>
                    <div className="measure" style={{ whiteSpace: 'pre-line' }}>
                      {biz.From_the_Business}
                    </div>
                  </div>
                )}
              </div>
              <div className={cx(styles.sidebar, 'flex-shrink-0')}>
                <SurveyView businessName={biz.Name} survey={survey} />
              </div>
            </div>
          ) : (
            survey && (
              // No badges
              <SurveyView columns={2} businessName={biz.Name} survey={survey} />
            )
          )}
        </Wrap>
      </div>
    </Page>
  );
};

export const query = graphql`
  query($slug: String!) {
    airtable(table: { eq: "Businesses" }, data: { URL_Key: { eq: $slug } }) {
      data {
        Name
        Facebook_Link
        From_the_Business
        Google_Maps_Link
        VNMM_Link
        Category {
          data {
            Name
            Businesses
          }
        }
        Neighborhood {
          data {
            Name
          }
        }
        Photos {
          localFiles {
            childImageSharp {
              fluid(maxWidth: 400, maxHeight: 250) {
                ...GatsbyImageSharpFluid_noBase64
              }
            }
          }
        }
        F_B_Survey {
          data {
            Coco_Points
            Dine_in_points
            Take_out_points
            Kitchen_points
            Menu_points
            No_plastic_straws
            No_plastic_bags
            BYO_container_discount
            Refill_my_bottle
            Dine_in_straws
            Dine_in_utensils
            Dine_in_napkins
            Dine_in_water
            Dine_in_cups
            Dine_in_drink_stirrers
            Dine_in_linens__table_or_placemats_
            Dine_in_dishes
            Restroom_hand_towels
            Take_out_bags
            Take_out_containers
            Take_out_cold_cups
            Take_out_hot_cups
            Take_out_container_lids
            Take_out_cup_lids
            Take_out_straws
            Take_out_cup_carriers
            Take_out_cup_sleeves
            Take_out_food_wrapping
            Plastic_free_delivery
            Kitchen_piping_bags
            Kitchen_pan_liners
            Kitchen_food_wrapping
            Kitchen_gloves
            Kitchen_food_freeze_packaging
            Kitchen_waste_management
            Food_waste_programs
            Menu
            Miscellaneous
            Status
            Survey_Prefill_Query_String
          }
        }
      }
    }
  }
`;

export default injectIntl(BusinessPage);
