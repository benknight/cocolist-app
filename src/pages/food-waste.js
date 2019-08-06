import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import BusinessList from '../components/BusinessList';
import Header from '../components/Header';
import { badges } from '../lib/badges';

const FoodWaste = ({ data, intl: { formatMessage }, location }) => {
  const foodWasteBadge = badges.find(b => b.key === 'foodWaste');
  const businesses = data.allAirtable.edges
    .filter(edge => foodWasteBadge.test(edge.node.data))
    .map(edge => edge.node.data.Business_record_match[0].data);
  const title = (
    <FormattedMessage
      id="business_list_heading"
      values={{
        city: formatMessage({ id: 'Saigon' }),
        thing: (
          <span className="green">
            {formatMessage({ id: 'food_waste_program_label' }).toLowerCase()}
          </span>
        ),
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
        table: { eq: "Food & Beverage Survey" }
        data: { Status: { eq: "Published" } }
      }
      sort: { fields: data___Coco_points, order: DESC }
    ) {
      edges {
        node {
          data {
            ...SurveyDataFragment
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
