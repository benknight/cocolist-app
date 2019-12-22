import cx from 'classnames';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import _get from 'lodash/get';
import _mean from 'lodash/mean';
import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  ContentActionsEditSmall,
  ContentModifierMapPinSmall,
  ContentModifierListSmall,
  NotificationAlertsWarningMedium,
} from '@thumbtack/thumbprint-icons';
import { TextButton } from '@thumbtack/thumbprint-react';
import Button from '../components/Button';
import Categories from '../components/Categories';
import Header from '../components/Header';
import Loader from '../components/Loader';
import ReviewForm from '../components/ReviewForm';
import StarRating from '../components/StarRating';
import BusinessRenderData from '../lib/common/BusinessRenderData';
import getSurveyDetails from '../lib/getSurveyDetails';
import useFirebase from '../lib/useFirebase';
import useLocalStorage from '../lib/useLocalStorage';
import styles from './BusinessPage.module.scss';

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
        Name_VI
        City {
          data {
            Name
            Name_VI
          }
        }
      }
    }
    Locations {
      data {
        Name
        Neighborhood {
          data {
            Name
            Name_VI
            City {
              data {
                Name
                Name_VI
              }
            }
          }
        }
      }
    }
    Profile_photo {
      localFiles {
        childImageSharp {
          fluid(maxWidth: 800, maxHeight: 480, cropFocus: CENTER) {
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

const BusinessPage = props => {
  const {
    data: {
      airtable: { data: bizData },
    },
    pageContext: { langKey },
  } = props;

  const firebase = useFirebase();
  const { formatMessage } = useIntl();
  const biz = new BusinessRenderData(bizData, langKey);
  const [citySelection] = useLocalStorage('citySelection');
  const localNeighborhoods = biz.neighborhoods
    .filter(hood => hood.City[0].data.Name === citySelection)
    .map(hood => formatMessage({ id: hood.Name }));
  const details = biz.survey ? getSurveyDetails(biz.survey) : [];
  const [reviews, setReviews] = useState(null);
  const reviewsMean =
    reviews && reviews.length > 0 ? _mean(reviews.map(r => r.rating)).toFixed(1) : null;

  useEffect(() => {
    let isMounted = true;
    firebase
      .firestore()
      .collection('reviews')
      .where('business.id', '==', biz.id)
      .get()
      .then(snapshot => {
        if (isMounted) {
          const reviews = [];
          snapshot.forEach(doc => reviews.push({ id: doc.id, ...doc.data() }));
          setReviews(reviews);
        }
      })
      .catch(error => {
        console.error(error);
        if (isMounted) {
          setReviews(false);
        }
      });
    return () => (isMounted = false);
  }, [firebase, biz.id]);

  const airtableForm = `https://airtable.com/shrw4zfDcry512acj?${_get(
    biz.survey,
    'Survey_prefill_query_string',
    '',
  )}`;

  return (
    <div className="bg-gray-200">
      <Helmet>
        <title>
          {biz.name} &ndash;{' '}
          {formatMessage(
            {
              id: 'eco_friendly_biz_in_vn',
            },
            { city: formatMessage({ id: 'Vietnam' }) },
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
            </div>
            <div className="tp-body-2">
              {reviews && reviews.length > 0 && (
                <div className="flex items-center mb2">
                  <StarRating rating={reviewsMean} size="small" />
                  <span className="ml1 black-300">
                    {reviewsMean} ({reviews.length})
                  </span>
                </div>
              )}
              <div className="flex items-start">
                <ContentModifierListSmall className="w1 mr2" />
                <div>
                  <Categories categories={biz.categories} />
                </div>
              </div>
              <div className="flex items-center mv1">
                <ContentModifierMapPinSmall className="w1 mr2" />
                {localNeighborhoods.length > 0 ? (
                  <div>{localNeighborhoods.join(', ')}</div>
                ) : (
                  <div>
                    {biz.cities.map((city, index) => (
                      <React.Fragment key={index}>
                        <FormattedMessage id={city.Name} />
                        {index === biz.cities.length - 1 ? '' : ', '}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="tp-body-2 mv1">
              <TextButton
                accessibilityLabel={formatMessage({ id: 'edit_business_action_label' })}
                onClick={() => window.open(airtableForm)}
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

            {/* Reviews */}

            <div className="mb5">
              <div className="tp-title-4 mb3">
                <FormattedMessage id="reviews_title" />
              </div>
              {reviews === null && <Loader />}
              <div className="measure mb5" style={{ whiteSpace: 'pre-line' }}>
                {reviews &&
                  reviews.length > 0 &&
                  reviews.map(review => (
                    <div key={review.id}>
                      <div className="flex items-center tp-body-3 black-300">
                        <StarRating rating={review.rating} />
                        <span className="ml2">
                          {review.created.toDate().toLocaleDateString()}
                        </span>
                      </div>
                      <div className="tp-body-2 mt1 mb4">
                        <FormattedMessage
                          id="review_comment"
                          values={{
                            b: (...args) => <b>{args}</b>,
                            name: review.user.name,
                            comment: review.comment,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
              <ReviewForm biz={biz} location={props.location} />
            </div>

            {/* No survey */}

            {!biz.survey && (
              <div className="lh-copy bt b-gray-300 pa4 tc mt4 ph3 s_ph5 flex flex-column items-center">
                <NotificationAlertsWarningMedium />
                <h3 className="tp-title-4 mt3 mb2">
                  <FormattedMessage id="business_no_data_title" />
                </h3>
                <p className="tp-body-2 mb3 mw7">
                  <FormattedMessage
                    id="business_no_data_description"
                    values={{ business: biz.name }}
                  />
                </p>
                <Button
                  icon={<ContentActionsEditSmall />}
                  onClick={() => window.open(airtableForm)}
                  size="small"
                  theme="primary">
                  <FormattedMessage id="edit_business_action_label" />
                </Button>
              </div>
            )}

            {/* Survey details */}

            {details.length > 0 && (
              <>
                <div className="mt0 mb3 flex items-baseline justify-between">
                  <h3 className="tp-title-4">
                    <FormattedMessage id="business_survey_heading" />
                  </h3>
                  <div className="ml2 tp-body-2">
                    <TextButton
                      onClick={() => window.open(airtableForm)}
                      iconLeft={<ContentActionsEditSmall className="w1" />}
                      theme="inherit">
                      <FormattedMessage id="edit_action_label" />
                    </TextButton>
                  </div>
                </div>
                <ul className="tp-body-3 ph0">
                  {details.map(([key, values]) => (
                    <li key={key} className="bb b-gray-300 mb2">
                      <div className="flex justify-between items-end">
                        <div className="b mr4">
                          <FormattedMessage id={key} />
                        </div>
                        <div className="tr flex items-center">
                          <div className="mr1 mw6">
                            {values &&
                              values.map((value, index) => (
                                <React.Fragment key={`${key}-${index}`}>
                                  <div className={styles.detailsValue}>
                                    <FormattedMessage id={value} />
                                  </div>
                                </React.Fragment>
                              ))}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;
