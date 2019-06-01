import cx from 'classnames';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import _get from 'lodash/get';
import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import {
  ContentActionsEditSmall,
  ContentActionsFlagSmall,
  ContentModifierMapPinSmall,
  ContentModifierListSmall,
  NotificationAlertsWarningMedium,
} from '@thumbtack/thumbprint-icons';
import { Button, Link as TPLink, TextButton, Wrap } from '@cocolist/thumbprint-react';
import FNBSurveyView from '../components/FNBSurveyView';
import Header from '../components/Header';
import Page from '../components/Page';
import badges from '../lib/badges';
import styles from './BusinessPage.module.scss';

const BusinessPage = props => {
  const {
    airtable: { data: biz },
  } = props.data;

  const thumbnail = _get(biz, 'Photos.localFiles[0].childImageSharp.fluid');

  const fbSurvey = (biz.F_B_Survey || [])
    .map(({ data }) => data)
    .find(({ Status }) => Status === 'Published');

  const cats = biz.Category.sort((a, b) => {
    return a.data.Businesses.length - b.data.Businesses.length;
  })
    .map(cat => cat.data.Name)
    .slice(0, 3);

  const bizBadges = [];

  if (_get(fbSurvey, 'No_plastic_straws')) {
    bizBadges.push(badges.noPlasticStraws);
  }
  if (_get(fbSurvey, 'No_plastic_bags')) {
    bizBadges.push(badges.noPlasticBags);
  }
  if (
    ['Always', 'Available on request'].indexOf(
      _get(fbSurvey, 'Plastic_free_delivery'),
    ) !== -1
  ) {
    bizBadges.push(badges.plasticFreeDelivery);
  }
  if (_get(fbSurvey, 'BYO_container_discount')) {
    bizBadges.push(badges.BYOC);
  }
  if (_get(fbSurvey, 'Refill_my_bottle')) {
    bizBadges.push(badges.refill);
  }
  if (_get(fbSurvey, 'Food_waste_programs', []).length > 0) {
    bizBadges.push(badges.foodWaste);
  }
  if (_get(fbSurvey, 'Kitchen_points', 0) > 3) {
    bizBadges.push(badges.kitchen);
  }

  const links = [];

  ['Google_Maps_Link', 'Facebook_Link', 'VNMM_Link'].forEach(link => {
    if (biz[link] && biz[link].length > 0) {
      links.push([link, biz[link].split(',')[0].trim()]);
    }
  });

  const onEditBusiness = () => {
    window.open(
      `https://airtable.com/shrw4zfDcry512acj?${_get(
        fbSurvey,
        'Survey_Prefill_Query_String',
        '',
      )}`,
    );
  };

  return (
    <Page location={props.location}>
      <Helmet title={biz.Name} />

      <Header location={props.location} />

      <Wrap bleedBelow="medium">
        <div className="m_pv4 l_pv5">
          <div className="m_flex items-end mb5">
            <div className="m_w-33 order-1">
              {thumbnail && (
                <div className={cx(styles.thumbnailWrapper, 'l_ph4')}>
                  <Img alt="logo" fluid={thumbnail} objectFit="contain" />
                </div>
              )}
            </div>
            <div className="ph3 m_pv0 order-0 flex-auto">
              <h1 className="tp-title-1 mb2 mt3 l_mt0">{biz.Name}</h1>
              <div className="tp-body-1">
                <div className="flex items-center">
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
                        <TPLink to={url} shouldOpenInNewTab>
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
                  onClick={onEditBusiness}
                  iconLeft={<ContentActionsEditSmall className="w1" />}
                  theme="inherit">
                  <FormattedMessage id="edit_business_action_label" />
                </TextButton>
              </div>
            </div>
          </div>

          {bizBadges.length > 0 && (
            <div className="mv4 b-gray-300 m_mt0 m_mb5 m_pb5 m_bb l_flex flex-wrap">
              {bizBadges.map(badge => (
                <div
                  key={badge.title}
                  className="pa3 flex items-center l_flex-column l_w-25 l_pr5 l_pv0">
                  <div
                    className={cx(
                      styles.badgeImage,
                      'self-start flex-shrink-0 mr3 l_mb3',
                    )}>
                    <img alt="" className="dib l_dn w-100" src={badge.imageSmall} />
                    <img alt="" className="dn l_dib w-100" src={badge.imageLarge} />
                  </div>
                  <div>
                    <div className="tp-title-5 l_mb1" size={5}>
                      <FormattedMessage id={badge.title} />
                    </div>
                    {badge.description && (
                      <div className="tp-body-2 mw7">
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
          )}

          {fbSurvey ? (
            <div className="ph3">
              <FNBSurveyView businessName={biz.Name} data={fbSurvey} />
            </div>
          ) : (
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
              <Button
                icon={<ContentActionsEditSmall />}
                onClick={onEditBusiness}
                size="small"
                theme="secondary"
                to="https://cocolist.app/survey/fnb">
                <FormattedMessage id="edit_business_action_label" />
              </Button>
            </div>
          )}
        </div>
      </Wrap>
    </Page>
  );
};

export const query = graphql`
  query($slug: String!) {
    airtable(table: { eq: "Businesses" }, data: { URL_Key: { eq: $slug } }) {
      data {
        Category {
          data {
            Name
            Businesses
          }
        }
        Name
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
        Facebook_Link
        Google_Maps_Link
        VNMM_Link
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

export default BusinessPage;
