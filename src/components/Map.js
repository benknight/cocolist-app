import cx from 'classnames';
import { graphql, navigate, useStaticQuery } from 'gatsby';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { tpBreakpointLargeValue } from '@cocolist/thumbprint-tokens';
import markerGreen from '../assets/marker-green.png';
import { getBadgesFromSurvey } from '../lib/badges';
import { getLocalizedURL, parseLangFromURL } from '../lib/i18n';
import mapStyles from '../lib/map-styles.json';
import useBreakpoint from '../lib/useBreakpoint';
import useScript from '../lib/useScript';
import styles from './Map.module.scss';

const mapsScriptURL = `https://maps.googleapis.com/maps/api/js?key=${process.env.GATSBY_FIREBASE_API_KEY}`;

const query = graphql`
  {
    locations: allAirtable(filter: { table: { eq: "Locations" } }) {
      edges {
        node {
          data {
            Name
            LatLng
            Business {
              data {
                Location_count
                Name
                Survey {
                  data {
                    ...FBSurveyDataFragment
                  }
                }
                URL_key
              }
            }
          }
        }
      }
    }
  }
`;

const mapCenter = {
  danang: 'TODO',
  hanoi: 'TODO',
  saigon: {
    xs: '10.788890, 106.709555',
    small: '10.788890, 106.709555',
    medium: '10.788890, 106.709555',
    large: '10.791881, 106.653460',
  },
};

// Make it possible to programmatically navigate from infoWindow
if (typeof window !== 'undefined') {
  window.__navigate = navigate;
}

// Cache Google Maps objects
let infoWindow;

const Map = ({ className, center, intl: { formatMessage }, location }) => {
  const lang = parseLangFromURL(location.pathname);
  const [loaded, error] = useScript(mapsScriptURL);
  if (error) {
    throw new Error(error);
  }
  const data = useStaticQuery(query);
  const breakpoint = useBreakpoint();
  useEffect(() => {
    if (loaded && typeof window !== 'undefined') {
      const { maps } = window.google,
        locations = data.locations.edges.map(edge => edge.node.data);
      infoWindow =
        infoWindow ||
        new maps.InfoWindow({
          disableAutoPan: breakpoint === 'large',
        });
      const map = new maps.Map(document.getElementById('map'));
      map.setOptions({
        center: new maps.LatLng(
          mapCenter[center][breakpoint].split(',')[0].trim(),
          mapCenter[center][breakpoint].split(',')[1].trim(),
        ),
        disableDefaultUI: true,
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: maps.ControlPosition.RIGHT_BOTTOM,
        },
        gestureHandling: breakpoint === 'large' ? 'greedy' : 'auto',
        styles: mapStyles,
        zoom: 13,
      });

      // Add locations to map
      locations
        .filter(data => {
          const survey = _get(data, 'Business[0].data.Survey[0].data');
          return survey && getBadgesFromSurvey(survey).length > 0;
        })
        .forEach(loc => {
          const biz = loc.Business[0].data,
            bizLink = getLocalizedURL('/' + biz.URL_key, lang),
            survey = _get(biz, 'Survey[0].data'),
            badges = getBadgesFromSurvey(survey),
            lat = loc.LatLng.split(',')[0].trim(),
            lng = loc.LatLng.split(',')[1].trim(),
            marker = new maps.Marker({
              // icon: badges.length > 2 ? markerGreen : markerPaleGreen,
              icon: markerGreen,
              map,
              position: new maps.LatLng(lat, lng),
            }),
            showLocationInfo = biz.Location_count > 1,
            infoWindowContent = `
              <div class="${cx('tp-body-2 mw6', styles.infoWindow)}">
                <a class="tp-title-6 mb2 color-inherit" href="${bizLink}" onclick="window.__navigate('${bizLink}'); return false;">
                  ${biz.Name}
                  ${showLocationInfo ? `&ndash; ${loc.Name}` : ''}
                </a>
                ${badges
                  .map(
                    badge => `
                      <div class="flex items-center">
                        <img alt="" class="w2 h2 mr2" src="${require(`../assets/badges/${badge.imageSmall}`)}" />
                        ${formatMessage({ id: badge.title })}
                      </div>
                    `,
                  )
                  .join('')}
              </div>
            `;

          // bounds.extend(marker.position);
          marker.addListener('click', () => {
            if (breakpoint === 'large') {
              navigate(bizLink);
            } else {
              infoWindow.setContent(infoWindowContent);
              infoWindow.open(map, marker);
            }
          });
          marker.addListener('mouseout', () => {
            if (breakpoint === 'large') {
              infoWindow.close();
            }
          });
          marker.addListener('mouseover', () => {
            if (window.innerWidth > tpBreakpointLargeValue) {
              infoWindow.setContent(infoWindowContent);
              infoWindow.open(map, marker);
            }
          });
        });
      // map.fitBounds(bounds);
    }
  }, [breakpoint, center, data, formatMessage, lang, loaded]);
  return (
    <div className={className}>
      <div id="map" className="absolute top0 right0 bottom0 left0" />
    </div>
  );
};

Map.propTypes = {
  center: PropTypes.string.isRequired,
  className: PropTypes.string,
  location: PropTypes.object.isRequired,
};

export default injectIntl(Map);
