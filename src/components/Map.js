import cx from 'classnames';
import { graphql, navigate, useStaticQuery } from 'gatsby';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { tpBreakpointLargeValue } from '@thumbtack/thumbprint-tokens';
import mapStyles from '../assets/map-styles.json';
import markerIcon from '../assets/marker.png';
import { getBadgesFromSurvey } from '../lib/common/Badges';
import { getLocalizedURL, parseLangFromURL } from '../lib/common/i18n';
import useBreakpoint from '../lib/useBreakpoint';
import useScript from '../lib/useScript';
import styles from './Map.module.scss';

const mapsScriptURL = `https://maps.googleapis.com/maps/api/js?key=${process.env.GATSBY_FIREBASE_API_KEY}`;

const query = graphql`
  {
    locations: allAirtable(
      filter: {
        table: { eq: "Locations" }
        data: {
          Business: {
            elemMatch: {
              data: { Survey: { elemMatch: { data: { Status: { eq: "Published" } } } } }
            }
          }
        }
      }
    ) {
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

// Make it possible to programmatically navigate from infoWindow
if (typeof window !== 'undefined') {
  window.__navigate = navigate;
}

// Cache Google Maps objects
let infoWindow;

const Map = ({ className, center, intl: { formatMessage }, location, zoom }) => {
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
      const centerLatLng = new maps.LatLng(
        center.split(',')[0].trim(),
        center.split(',')[1].trim(),
      );
      map.setOptions({
        center: centerLatLng,
        disableDefaultUI: true,
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: maps.ControlPosition.RIGHT_BOTTOM,
        },
        gestureHandling: breakpoint === 'large' ? 'greedy' : 'auto',
        styles: mapStyles,
        zoom,
      });

      if (process.env.NODE_ENV === 'development') {
        map.addListener('center_changed', function() {
          console.log(map.getCenter().lat(), map.getCenter().lng());
        });
      }

      if (breakpoint === 'large') {
        window.google.maps.event.addListenerOnce(map, 'projection_changed', () => {
          // latlng is the apparent centre-point
          // offsetx is the distance you want that point to move to the right, in pixels
          // offsety is the distance you want that point to move upwards, in pixels
          // offset can be negative
          // offsetx and offsety are both optional
          const offsetX = 400;
          const offsetY = 0;

          const scale = Math.pow(2, map.getZoom());

          const worldCoordinateCenter = map
            .getProjection()
            .fromLatLngToPoint(centerLatLng);

          const pixelOffset = new window.google.maps.Point(
            offsetX / scale || 0,
            offsetY / scale || 0,
          );

          const worldCoordinateNewCenter = new window.google.maps.Point(
            worldCoordinateCenter.x - pixelOffset.x,
            worldCoordinateCenter.y + pixelOffset.y,
          );

          const newCenter = map
            .getProjection()
            .fromPointToLatLng(worldCoordinateNewCenter);

          map.setCenter(newCenter);
        });
      }

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
              icon: markerIcon,
              map,
              position: new maps.LatLng(lat, lng),
            }),
            showLocationInfo = biz.Location_count > 1,
            infoWindowContent = `
              <div class="${cx('tp-body-2 mw6', styles.infoWindow)}">
                <a class="dib tp-title-6 mb2 color-inherit" href="${bizLink}" onclick="window.__navigate('${bizLink}'); return false;">
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
  }, [breakpoint, center, data, formatMessage, lang, loaded, zoom]);
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
