import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import _get from 'lodash/get';
import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import FBSurveyView from '../components/FBSurveyView';
import Header from '../components/Header';
import Page from '../components/Page';
import styles from './BusinessPage.module.css';

const BusinessPage = props => {
  const {
    airtable: { data: biz },
  } = props.data;
  const thumbnail = _get(biz, 'Photos.localFiles[0].childImageSharp.fluid');
  return (
    <Page location={props.location}>
      <Helmet title={biz.Name} />
      <Header />
      {thumbnail && (
        <div className={styles.thumbnailWrapper}>
          <Img alt="logo" className="mw6 center" fluid={thumbnail} objectFit="contain" />
        </div>
      )}
      <div className="pa3">
        <h1 className="mb2">{biz.Name}</h1>
        <div className="lh-copy mb4">
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
        {biz.F_B_Survey[0].data ? (
          <FBSurveyView data={biz.F_B_Survey[0].data} />
        ) : (
          'No data' // TODO
        )}
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
