import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import BusinessList, { BusinessListSelector } from '../components/BusinessList';
import Header from '../components/Header';
import getBusinessesFromSurveyData from '../lib/getBusinessesFromSurveyData';

const NoPlasticStraws = ({ data, intl: { formatMessage }, location }) => {
  const businesses = getBusinessesFromSurveyData(data.allAirtable.edges);
  const title = (
    <FormattedMessage
      id="business_list_heading"
      values={{
        city: formatMessage({ id: 'Vietnam' }),
        thing: <BusinessListSelector selected="no-plastic-straws" />,
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
              thing: formatMessage({ id: 'no_plastic_straws_label' }).toLowerCase(),
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
        data: { Status: { eq: "Published" }, No_plastic_straws: { eq: true } }
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

export default injectIntl(NoPlasticStraws);
