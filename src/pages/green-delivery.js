import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import BusinessList from '../components/BusinessList';
import Header from '../components/Header';
import sortBusinesses from '../lib/sortBusinesses';

const GreenDelivery = ({ data, intl: { formatMessage }, location }) => {
  const businesses = data.allAirtable.edges
    .map(edge => edge.node.data.Business_record_match[0].data)
    .sort(sortBusinesses);
  const title = (
    <FormattedMessage
      id="business_list_heading"
      values={{
        city: formatMessage({ id: 'Saigon' }),
        thing: (
          <span className="green">
            {formatMessage({ id: 'green_delivery_label' }).toLowerCase()}
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
        table: { eq: "Food & Beverage Survey" }
        data: {
          Status: { eq: "Published" }
          Plastic_free_delivery: { in: ["Always", "Available on request"] }
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
