import cx from 'classnames';
import { Link, graphql, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  ModalDefault,
  ModalDefaultHeader,
  ModalDefaultTitle,
  ModalDefaultContent,
  TextButton,
} from '@thumbtack/thumbprint-react';
import { ContentModifierMapPinSmall } from '@thumbtack/thumbprint-icons';

import { getLocalizedURL, parseLangFromURL } from '../lib/common/i18n';
import useLocalStorage from '../lib/useLocalStorage';
import styles from './CitySelector.module.scss';

const query = graphql`
  {
    cities: allAirtable(
      filter: { table: { eq: "Cities" } }
      sort: { fields: data___Location_count, order: DESC }
    ) {
      edges {
        node {
          data {
            Name
            Slug
            Cover {
              localFiles {
                childImageSharp {
                  fluid(maxWidth: 600, maxHeight: 375) {
                    ...GatsbyImageSharpFluid_noBase64
                  }
                  fixed(width: 160, height: 100) {
                    ...GatsbyImageSharpFixed_noBase64
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

const CitySelector = injectIntl(
  ({ children, className, location, intl: { formatMessage }, variant }) => {
    const [, setCitySelection] = useLocalStorage('citySelection');
    const data = useStaticQuery(query);
    const [isModalOpen, setModalOpen] = useState(false);
    const langKey = parseLangFromURL(location.pathname);

    if (variant === 'grid') {
      return (
        <div className={cx(className, styles.grid, 'grid')}>
          {data.cities.edges.map(({ node: { data: city } }) => (
            <div className="col-12 m_col-6 mt4" key={city.Name}>
              <Link
                className="relative db mr2 flex-shrink-0"
                onClick={() => setCitySelection(city.Name)}
                to={getLocalizedURL(`/${city.Slug}`, langKey)}>
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
                    'absolute top0 bottom0 right0 left0 white flex items-center justify-center',
                  )}>
                  <FormattedMessage id={city.Name} />
                </div>
              </Link>
            </div>
          ))}
        </div>
      );
    }

    if (variant === 'modal') {
      return (
        <div className={className}>
          <TextButton
            onClick={() => setModalOpen(!isModalOpen)}
            iconLeft={<ContentModifierMapPinSmall />}>
            {children}
          </TextButton>
          <ModalDefault isOpen={isModalOpen} onCloseClick={() => setModalOpen(false)}>
            <ModalDefaultHeader>
              <ModalDefaultTitle>
                {formatMessage({ id: 'select_city_label' })}
              </ModalDefaultTitle>
            </ModalDefaultHeader>
            <ModalDefaultContent>
              <CitySelector location={location} variant="grid" />
            </ModalDefaultContent>
          </ModalDefault>
        </div>
      );
    }
    return null;
  },
);

CitySelector.propTypes = {
  variant: PropTypes.oneOf(['grid', 'thumbnails', 'modal']).isRequired,
};

export default CitySelector;
