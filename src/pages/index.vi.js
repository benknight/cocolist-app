import { graphql } from 'gatsby';
import React from 'react';
import Index from './index.en';

export default props => <Index {...props} />;

export const query = graphql`
  query {
    surveys: allAirtable(
      filter: {
        table: { eq: "Food & Beverage Survey" }
        data: {
          Business_record_match: { elemMatch: { data: { Record_ID: { ne: null } } } }
        }
      }
      sort: {
        fields: [
          data___Coco_points
          data___Business_record_match___data___VNMM_rating_count
        ]
        order: DESC
      }
    ) {
      edges {
        ...HomepageSurveyFragment
      }
    }
  }
`;
