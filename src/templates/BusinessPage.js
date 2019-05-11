import cx from 'classnames';
import { graphql } from 'gatsby';
import _get from 'lodash/get';
import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import Header from '../components/Header';
import Page from '../components/Page';
import styles from './BusinessPage.module.css';

const BusinessPage = props => {
  const {
    airtable: { data: biz },
  } = props.data;
  const thumbnail = _get(biz, 'Photos[0].thumbnails.large');
  return (
    <Page location={props.location}>
      <Helmet title={biz.Name} />
      <Header />
      {thumbnail && (
        <img
          alt=""
          className={cx(styles.thumbnail, 'bb b--light-gray')}
          src={thumbnail.url}
          width={thumbnail.width}
        />
      )}
      <div className="pa3">
        <h1 className="mb2">{biz.Name}</h1>
        <div>
          {biz.Category.map(({ data }, index) => (
            <React.Fragment key={index}>
              <FormattedMessage id={data.Name} />
              {index === biz.Category.length - 1 ? '' : ', '}
            </React.Fragment>
          ))}
          <span className="dib black-30 mh2">/</span>
          {biz.Neighborhood.map(({ data }, index) => (
            <React.Fragment key={index}>
              <FormattedMessage id={data.Name} />
              {index === biz.Neighborhood.length - 1 ? '' : ', '}
            </React.Fragment>
          ))}
        </div>
      </div>
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
          }
        }
        Name
        Neighborhood {
          data {
            Name
          }
        }
        Photos {
          thumbnails {
            large {
              height
              url
              width
            }
          }
        }
        F_B_Survey {
          data {
            Dine_in_straws
            Dine_in_utensils
            Dine_in_napkins
            Dine_in_water
            Dine_in_cups
            Dine_in_drink_stirrers
            Dine_in_linens__table_or_placemats_
            Dine_in_dishes
            Restroom_hand_towels
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
            Menu
            Miscellaneous
            Dine_in_points
            Take_out_points
            Kitchen_points
            Menu_points
            Total_points
            Status
          }
        }
      }
    }
  }
`;

export default BusinessPage;
