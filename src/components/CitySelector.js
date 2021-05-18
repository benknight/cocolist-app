import cx from 'classnames';
import { Link, graphql, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getLocalizedURL, parseLangFromURL } from '../lib/common/i18n';
import useCitySelection from '../lib/useCitySelection';
import styles from './CitySelector.module.scss';

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

const CitySelector = injectIntl(({ className, location, include }) => {
  const [, setCitySelection] = useCitySelection();
  const data = useStaticQuery(query);
  const langKey = parseLangFromURL(location.pathname);

  return (
    <div className={cx(className, styles.grid, 'grid')}>
      {data.cities.edges
        .map(({ node: { data: city } }) => city)
        .filter(city => (include ? include.includes(city.URL) : true))
        .map(city => (
          <div className="col-12 m_col-6 l_col-4 mt3" key={city.Name}>
            <Link
              className="relative db flex-shrink-0"
              onClick={() => setCitySelection(city.Name)}
              to={getLocalizedURL(`/${city.URL}`, langKey)}>
              <Img
                alt="logo"
                className="br2"
                fluid={city.Cover.localFiles[0].childImageSharp.fluid}
                objectFit="cover"
                title={city.Name}
              />
              <div
                className={cx(
                  styles.text,
                  'absolute top0 bottom0 right0 left0 white flex items-center justify-center pa4 tc',
                )}>
                <FormattedMessage id={city.Name} />
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
});

export default CitySelector;
