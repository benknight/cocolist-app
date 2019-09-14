import cx from 'classnames';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import _get from 'lodash/get';
import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  ContentActionsEditSmall,
  ContentModifierMapPinSmall,
  ContentModifierListSmall,
} from '@thumbtack/thumbprint-icons';
import { Link as TPLink, TextButton } from '@cocolist/thumbprint-react';
import AirtableFormModal from '../components/AirtableFormModal';
import Categories from '../components/Categories';
import Header from '../components/Header';
import SurveyView from '../components/SurveyView';
import BusinessRenderData from '../lib/BusinessRenderData';
import styles from './BusinessPage.module.scss';

const BusinessPage = props => {
  const {
    data: {
      airtable: { data: bizData },
    },
    intl: { formatMessage },
    pageContext: { langKey },
  } = props;

  const biz = new BusinessRenderData(bizData, langKey);
  const [showEditModal, toggleEditModal] = useState(false);

  return (
    <div className="bg-gray-200">
      <Helmet>
        <title>
          {biz.name} &ndash;{' '}
          {formatMessage(
            {
              id: 'eco_friendly_biz_in_vn',
            },
            { city: formatMessage({ id: 'Saigon' }) },
          )}
        </title>
        {/* TODO: Add social meta tags */}
      </Helmet>

      <Header location={props.location} />

      <div className={cx(styles.container, 'shadow-1 center bg-white')}>
        <div className="mb4">
          <div className={cx(styles.sidebar, 'flex-shrink-0 order-1 self-end')}>
            {biz.thumbnail && (
              <div className={styles.thumbnailWrapper}>
                <Img alt="logo" fluid={biz.thumbnail} objectFit="contain" />
              </div>
            )}
          </div>
          <div className="relative ph3 s_ph5 order-0">
            <div className="flex items-end mb2 mt3 s_mt4">
              <h1 className="tp-title-1 flex-auto">{biz.name}</h1>
              {biz.links.length > 0 && (
                <div className="flex flex-wrap flex-shrink-0 self-start ml4">
                  {biz.links.map(([link, url, icon], index) => (
                    <div
                      key={link}
                      className="inline-flex items-center bg-gray-300 br2 ml1 pa2 m_w-auto"
                      title={formatMessage({ id: link.toLowerCase() })}>
                      <TPLink
                        accessibilityLabel={formatMessage({ id: link.toLowerCase() })}
                        iconLeft={icon}
                        shouldOpenInNewTab
                        theme="inherit"
                        to={url}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="tp-body-2">
              <div className="flex items-start">
                <ContentModifierListSmall className="w1 mr2" />
                <div>
                  <Categories categories={biz.categories} />
                </div>
              </div>
              <div className="flex items-center mv1">
                <ContentModifierMapPinSmall className="w1 mr2" />
                <div>
                  {biz.neighborhoods.map((name, index) => (
                    <React.Fragment key={index}>
                      <FormattedMessage id={name} />
                      {index === biz.neighborhoods.length - 1 ? '' : ', '}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
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

        <div className="ph3 s_ph5 pb5">
          <div className="flex-auto">
            {biz.badges.length > 0 && (
              <div className="mv4">
                {biz.badges.map(badge => (
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
                              business: biz.name,
                              byoc_percent: biz.survey.BYOC_discount_amount
                                ? `${biz.survey.BYOC_discount_amount * 100}%`
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

            {/* From the business */}

            {_get(biz, 'survey.From_the_business') && (
              <div className="mb5">
                <div className="tp-title-4 mb3">
                  <FormattedMessage id="from_the_business_heading" />
                </div>
                <div className="measure" style={{ whiteSpace: 'pre-line' }}>
                  {biz.survey.From_the_business}
                </div>
              </div>
            )}

            {/* From the editor */}

            {_get(biz, 'survey.From_the_editor') && (
              <div className="mb5">
                <div className="tp-title-4 mb3">
                  <FormattedMessage id="from_the_editor_heading" />
                </div>
                <div className="measure" style={{ whiteSpace: 'pre-line' }}>
                  {biz.survey.From_the_editor}
                </div>
              </div>
            )}

            {/* Business photos */}

            {biz.photos.length > 0 && (
              <div className="mb5">
                <div className="tp-title-4 mb3">
                  <FormattedMessage id="business_photos_heading" />
                </div>
                {biz.photos.map((photo, index) => {
                  return (
                    <a
                      className="dib ml0-m mt1 mr1"
                      href={photo.raw.thumbnails.large.url}
                      key={index}
                      rel="noopener noreferrer"
                      target="_blank">
                      <Img alt={photo.raw.filename} className="br1" fixed={photo.fixed} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
          <SurveyView biz={biz} onClickEdit={() => toggleEditModal(true)} />
        </div>
      </div>
      <AirtableFormModal
        formId="shrw4zfDcry512acj"
        isOpen={showEditModal}
        onCloseClick={() => toggleEditModal(false)}
        prefill={_get(biz.survey, 'Survey_prefill_query_string', '')}
      />
    </div>
  );
};

export const query = graphql`
  fragment FBSurveyDataFragment on AirtableData {
    From_the_business
    From_the_editor
    Coco_points
    Dine_in_points
    Take_out_points
    Kitchen_points
    Menu_points
    No_plastic_straws
    No_plastic_bags
    No_plastic_bottles
    BYO_container_discount
    BYOC_discount_amount
    Free_drinking_water
    Green_delivery
    Delivery_only
    Dine_in_straws
    Dine_in_utensils
    Dine_in_napkins
    Dine_in_drink_containers
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
    Attachments {
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
  }

  fragment BusinessDataFragment on AirtableData {
    Record_ID
    Name
    Facebook_link
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
          fluid(maxWidth: 800, maxHeight: 480) {
            ...GatsbyImageSharpFluid_noBase64
          }
        }
      }
    }
    Survey {
      data {
        ...FBSurveyDataFragment
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
