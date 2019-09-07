import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { injectIntl } from 'react-intl';
import BusinessList from '../components/BusinessList';
import Header from '../components/Header';
import getBusinessesFromSurveyData from '../lib/getBusinessesFromSurveyData';

const TopTen = ({ data, intl: { formatMessage }, location, title }) => {
  const businesses = getBusinessesFromSurveyData(
    data.allAirtable.edges.filter(
      edge => edge.node.data.Business_record_match.length > 0,
    ),
  ).slice(0, 10);
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
        table: { eq: "Survey" }
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
