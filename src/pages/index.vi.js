import { graphql } from 'gatsby';
import React from 'react';
import Index from './index';

export default props => <Index {...props} />;

export const query = graphql`
  query {
    surveys: allAirtable(
      filter: {
        table: { eq: "Food & Beverage Survey" }
        data: {
          Business_Record_Match: { elemMatch: { data: { Record_ID: { ne: null } } } }
        }
      }
      sort: {
        fields: [
          data___Coco_Points
          data___Business_Record_Match___data___VNMM_Rating_Count
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
