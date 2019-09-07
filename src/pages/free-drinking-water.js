import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import BusinessList, { BusinessListSelector } from '../components/BusinessList';
import Header from '../components/Header';
import getBusinessesFromSurveyData from '../lib/getBusinessesFromSurveyData';

const RefillMyBottle = ({ data, intl: { formatMessage }, location }) => {
  const businesses = getBusinessesFromSurveyData(data.allAirtable.edges);
  const title = (
    <FormattedMessage
      id="business_list_heading"
      values={{
        city: formatMessage({ id: 'Saigon' }),
        thing: <BusinessListSelector selected="free-drinking-water" />,
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
              thing: formatMessage({ id: 'refill_my_bottle_label' }).toLowerCase(),
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
        data: { Status: { eq: "Published" }, Free_drinking_water: { eq: true } }
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

export default injectIntl(RefillMyBottle);
