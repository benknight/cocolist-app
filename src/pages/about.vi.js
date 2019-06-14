import React from 'react';
import { graphql } from 'gatsby';
import About from './about.en';

export default props => <About {...props} />;

export const query = graphql`
  query {
    file(relativePath: { eq: "trash-in-vietnam.jpg" }) {
      childImageSharp {
        fluid(quality: 90, maxWidth: 4000) {
          ...GatsbyImageSharpFluid_noBase64
        }
      }
    }
  }
`;
