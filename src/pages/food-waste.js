import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import BusinessList, { BusinessListSelector } from '../components/BusinessList';
import Header from '../components/Header';
import { badges } from '../lib/Badges.common';
import getBusinessesFromSurveyData from '../lib/getBusinessesFromSurveyData';

const FoodWaste = ({ data, intl: { formatMessage }, location }) => {
  const foodWasteBadge = badges.find(b => b.key === 'foodWaste');
  const businesses = getBusinessesFromSurveyData(
    data.allAirtable.edges.filter(edge => foodWasteBadge.test(edge.node.data)),
  );
  const title = (
    <FormattedMessage
      id="business_list_heading"
      values={{
        city: formatMessage({ id: 'Saigon' }),
        thing: <BusinessListSelector selected="food-waste" />,
      }}
    />
  );
  return (
    <>
      <Helmet>
        <title>
          {formatMessage(
            { id: 'business_list_heading' },
            {
              city: formatMessage({ id: 'Saigon' }),
              thing: formatMessage({ id: 'food_waste_program_label' }).toLowerCase(),
            },
          )}
        </title>
      </Helmet>
      <Header location={location} />
      <BusinessList businesses={businesses} location={location} title={title} />
    </>
  );
};

export const query = graphql`
  {
    allAirtable(
      filter: {
        table: { eq: "Survey" }
        data: { Status: { eq: "Published" } }
      }
      sort: { fields: data___Coco_points, order: DESC }
    ) {
      edges {
        node {
          data {
            ...FBSurveyDataFragment
            Business_record_match {
              data {
                ...BusinessDataFragment
              }
            }
          }
        }
      }
    }
  }
`;

export default injectIntl(FoodWaste);
