import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { injectIntl } from 'react-intl';
import BusinessList from '../components/BusinessList';
import Header from '../components/Header';
import sortBusinesses from '../lib/sortBusinesses';

const TopTen = ({ data, intl: { formatMessage }, location, title }) => {
  const businesses = data.allAirtable.edges
    .map(edge => edge.node.data.Business_record_match[0].data)
    .sort(sortBusinesses)
    .slice(0, 10);
  return (
    <>
      <Helmet>
        <title>
          {formatMessage(
            { id: 'top_ten_businesses_heading' },
            { city: formatMessage({ id: 'Saigon' }) },
          )}
        </title>
      </Helmet>
      <Header location={location} />
      <BusinessList
        businesses={businesses}
        location={location}
        maxColumns={2}
        title={formatMessage(
          {
            id: 'top_ten_businesses_heading',
          },
          { city: formatMessage({ id: 'Saigon' }) },
        )}
      />
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

export default injectIntl(TopTen);
