import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import BusinessList, { BusinessListSelector } from '../components/BusinessList';
import Header from '../components/Header';
import getBusinessesFromSurveyData from '../lib/getBusinessesFromSurveyData';

const GreenDelivery = ({ data, intl: { formatMessage }, location }) => {
  const businesses = getBusinessesFromSurveyData(data.allAirtable.edges);
  const title = (
    <FormattedMessage
      id="business_list_heading"
      values={{
        city: formatMessage({ id: 'Vietnam' }),
        thing: <BusinessListSelector selected="green-delivery" />,
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
              city: formatMessage({ id: 'Vietnam' }),
              thing: formatMessage({ id: 'green_delivery_label' }).toLowerCase(),
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
        data: {
          Status: { eq: "Published" }
          Green_delivery: { in: ["100% plastic-free", "Reduced plastic"] }
        }
      }
      sort: { fields: data___Coco_points, order: DESC }
    ) {
      edges {
        node {
          data {
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

export default injectIntl(GreenDelivery);
