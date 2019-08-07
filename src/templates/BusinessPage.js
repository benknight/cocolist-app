import cx from 'classnames';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import _get from 'lodash/get';
import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  ContentActionsEditSmall,
  ContentActionsFlagSmall,
  ContentModifierMapPinSmall,
  ContentModifierListSmall,
  NotificationAlertsWarningMedium,
} from '@thumbtack/thumbprint-icons';
import { Link as TPLink, Button, TextButton } from '@cocolist/thumbprint-react';
import AirtableFormModal from '../components/AirtableFormModal';
import Categories from '../components/Categories';
import Header from '../components/Header';
import SurveyView from '../components/SurveyView';
import { getBadgesFromSurvey } from '../lib/badges';
import { getLocalizedVNMMURL } from '../lib/i18n';
import styles from './BusinessPage.module.scss';

const BusinessPage = props => {
  const {
    data: {
      airtable: { data: biz },
    },
    intl: { formatMessage },
    pageContext: { langKey },
  } = props;

  const thumbnail = _get(biz, 'Profile_photo.localFiles[0].childImageSharp.fluid');

  const survey = (biz.F_B_survey || [])
    .map(({ data }) => data)
    .find(({ Status }) => Status === 'Published');

  const bizBadges = survey ? getBadgesFromSurvey(survey) : [];

  const links = [];

  ['Google_Maps_link', 'Facebook_link', 'VNMM_link'].forEach(linkName => {
    if (biz[linkName] && biz[linkName].length > 0) {
      let url = biz[linkName].split(',')[0].trim();
      if (linkName === 'VNMM_link') {
        url = getLocalizedVNMMURL(url, langKey);
      }
      links.push([linkName, url]);
    }
  });

  const [showEditModal, toggleEditModal] = useState(false);

  return (
    <div className="bg-gray-200">
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

      <div className={cx(styles.container, 'shadow-1 center bg-white')}>
        <div className="mb4">
          <div className={cx(styles.sidebar, 'flex-shrink-0 order-1 self-end')}>
            {thumbnail && (
              <div className={styles.thumbnailWrapper}>
                <Img alt="logo" fluid={thumbnail} objectFit="contain" />
              </div>
            )}
          </div>
          <div className="ph3 s_ph5 order-0">
            <div className="flex flex-wrap items-baseline mb2 mt3 s_mt4">
              <h1 className="tp-title-1">{biz.Name}</h1>
            </div>
            <div className="tp-body-2">
              <div className="flex items-start">
                <ContentModifierListSmall className="w1 mr2" />
                <div>
                  <Categories biz={biz} />
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
              <TextButton
                accessibilityLabel={formatMessage({ id: 'edit_business_action_label' })}
                onClick={() => toggleEditModal(true)}
                iconLeft={<ContentActionsEditSmall className="w1" />}
                theme="inherit">
                <FormattedMessage id="edit_business_action_label" />
              </TextButton>
            </div>
          </div>
        </div>

        {survey ? (
          <div className="ph3 s_ph5 pb5">
            <div className="flex-auto">
              {bizBadges.length > 0 && (
                <div className="mv4">
                  {bizBadges.map(badge => (
                    <div key={badge.key} className="flex items-center pv3">
                      <div
                        className={cx(styles.badgeImage, 'self-start flex-shrink-0 mr3')}>
                        <img
                          alt=""
                          className="dib w-100"
                          src={require(`../assets/badges/${badge.imageSmall}`)}
                        />
                      </div>
                      <div>
                        <div className="tp-title-5" size={5}>
                          <FormattedMessage id={badge.title} />
                        </div>
                        {badge.description && (
                          <div className="tp-body-2 measure">
                            <FormattedMessage
                              id={badge.description}
                              values={{
                                business: biz.Name,
                                byoc_percent: survey.BYOC_discount_amount
                                  ? `${survey.BYOC_discount_amount * 100}%`
                                  : '',
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {_get(biz, 'Business_photos.localFiles.length') > 0 && (
                <div className="mb5">
                  <div className="tp-title-4 mb3">
                    <FormattedMessage id="business_photos_heading" />
                  </div>
                  {biz.Business_photos.localFiles.map((photo, index) => {
                    const raw = biz.Business_photos.raw[index];
                    return (
                      <a
                        className="dib ml0-m mt1 mr1"
                        href={raw.thumbnails.large.url}
                        key={index}
                        rel="noopener noreferrer"
                        target="_blank">
                        <Img
                          alt={raw.filename}
                          className="br1"
                          fixed={photo.childImageSharp.fixed}
                        />
                      </a>
                    );
                  })}
                </div>
              )}
              {survey.From_the_business && (
                <div className="mb5">
                  <div className="tp-title-4 mb3">
                    <FormattedMessage id="from_the_business_heading" />
                  </div>
                  <div className="measure" style={{ whiteSpace: 'pre-line' }}>
                    {survey.From_the_business}
                  </div>
                </div>
              )}
              {survey.From_the_editor && (
                <div className="mb5">
                  <div className="tp-title-4 mb3">
                    <FormattedMessage id="from_the_editor_heading" />
                  </div>
                  <div className="measure" style={{ whiteSpace: 'pre-line' }}>
                    {survey.From_the_editor}
                  </div>
                </div>
              )}
            </div>
            {survey && (
              <SurveyView survey={survey} onClickEdit={() => toggleEditModal(true)} />
            )}
          </div>
        ) : (
          // No survey
          <div className="lh-copy pa4 tc mt4 ph3 s_ph5 flex flex-column items-center">
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
            <Button
              icon={<ContentActionsEditSmall />}
              onClick={() => toggleEditModal(true)}
              size="small"
              theme="primary">
              <FormattedMessage id="edit_business_action_label" />
            </Button>
          </div>
        )}
      </div>
      <AirtableFormModal
        formId="shrw4zfDcry512acj"
        isOpen={showEditModal}
        onCloseClick={() => toggleEditModal(false)}
        prefill={_get(survey, 'Survey_prefill_query_string', '')}
      />
    </div>
  );
};

export const query = graphql`
  fragment SurveyDataFragment on AirtableData {
    From_the_business
    From_the_editor
    Coco_points
    Dine_in_points
    Take_out_points
    Kitchen_points
    Menu_points
    No_plastic_straws
    No_plastic_bags
    BYO_container_discount
    BYOC_discount_amount
    Refill_my_bottle
    Plastic_free_delivery
    Delivery_only
    Dine_in_straws
    Dine_in_utensils
    Dine_in_napkins
    Dine_in_drinks
    Dine_in_cups
    Dine_in_drink_stirrers
    Dine_in_linens__table_or_placemats_
    Dine_in_dishes
    Restroom_hand_towels
    Take_out_bags
    Take_out_containers
    Take_out_cups
    Take_out_container_lids
    Take_out_cup_lids
    Take_out_straws
    Take_out_cup_carriers
    Take_out_cup_sleeves
    Take_out_food_wrapping
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
    Survey_prefill_query_string
  }

  fragment BusinessDataFragment on AirtableData {
    Record_ID
    Name
    Facebook_link
    Google_Maps_link
    VNMM_link
    URL_key
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
    Profile_photo {
      localFiles {
        childImageSharp {
          fluid(maxWidth: 400, maxHeight: 250) {
            ...GatsbyImageSharpFluid_noBase64
          }
        }
      }
    }
    Business_photos {
      localFiles {
        childImageSharp {
          fixed(width: 100, height: 100) {
            ...GatsbyImageSharpFixed_noBase64
          }
        }
      }
      raw {
        filename
        url
        thumbnails {
          large {
            url
          }
        }
      }
    }
    F_B_survey {
      data {
        ...SurveyDataFragment
      }
    }
  }

  query($slug: String!) {
    airtable(table: { eq: "Businesses" }, data: { URL_key: { eq: $slug } }) {
      data {
        ...BusinessDataFragment
      }
    }
  }
`;

export default injectIntl(BusinessPage);
