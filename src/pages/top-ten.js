import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { injectIntl } from 'react-intl';
import BusinessList from '../components/BusinessList';
import Header from '../components/Header';

const TopTen = ({ data, intl: { formatMessage }, location, title }) => {
  const businesses = data.allAirtable.edges.map(
    edge => edge.node.data.Business_record_match[0].data,
  );
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
      sort: { fields: data___Coco_points, order: DESC }
      limit: 10
    ) {
      edges {
        node {
          data {
            Business_record_match {
              data {
                ...fullBizData
              }
            }
          }
        }
      }
    }
  }
`;

export default injectIntl(TopTen);
