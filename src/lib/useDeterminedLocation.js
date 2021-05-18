import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';

const query = graphql`
  {
    cities: allAirtable(
      filter: { table: { eq: "Cities" }, data: { Published: { eq: true } } }
      sort: { fields: data___Location_count, order: DESC }
    ) {
      edges {
        node {
          data {
            Name
            URL
            Cover {
              localFiles {
                childImageSharp {
                  fluid(
                    maxWidth: 600
                    maxHeight: 400
                    srcSetBreakpoints: [480, 700, 1024]
                  ) {
                    ...GatsbyImageSharpFluid_withWebp_noBase64
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export function useDeterminedLocation() {
  const data = useStaticQuery(query);
  React.useEffect(() => {
    if (!navigator.geolocation) {
      status.textContent = 'Geolocation is not supported by your browser';
    } else {
      status.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(success, error);
    }
  });
}
