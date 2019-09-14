import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import BusinessList, { BusinessListSelector } from '../components/BusinessList';
import Header from '../components/Header';
import { badges } from '../lib/badges';
import getBusinessesFromSurveyData from '../lib/getBusinessesFromSurveyData';

const GreenKitchen = ({ data, intl: { formatMessage }, location }) => {
  const kitchenBadge = badges.find(b => b.key === 'kitchen');
  const businesses = getBusinessesFromSurveyData(
    data.allAirtable.edges.filter(edge => kitchenBadge.test(edge.node.data)),
  );
  const title = (
    <FormattedMessage
      id="business_list_heading"
      values={{
        city: formatMessage({ id: 'Saigon' }),
        thing: <BusinessListSelector selected="green-kitchen" />,
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
              thing: formatMessage({ id: 'green_kitchen_label' }).toLowerCase(),
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

export default injectIntl(GreenKitchen);
