const _camelCase = require('lodash/camelCase');
const _get = require('lodash/get');
const _mapKeys = require('lodash/mapKeys');
const _uniqBy = require('lodash/uniqBy');
const { getLocalizedURL } = require('./i18n');
const { getBadgesFromSurvey } = require('./Badges');

function getBizPresenter(data, langKey) {
  return {
    ..._mapKeys(data, (value, key) => _camelCase(key)),

    get url() {
      return getLocalizedURL(`/${data.URL}`, langKey);
    },

    get coverPhoto() {
      return _get(data, 'Cover_photo.localFiles[0].childImageSharp.fluid');
    },

    get profilePhoto() {
      return _get(data, 'Profile_photo.localFiles[0].childImageSharp.fluid');
    },

    get badges() {
      return getBadgesFromSurvey(data);
    },

    get cities() {
      const cities = _uniqBy(
        this.neighborhoods.map(hood => hood.City[0].data),
        'Name',
      );
      return cities;
    },

    get neighborhoods() {
      let hoods = _uniqBy(
        (data.Locations || [])
          .filter(({ data }) => !!_get(data, 'Neighborhood[0].data.Name'))
          .map(({ data }) => data.Neighborhood[0].data),
        'Name',
      );
      if (hoods.length === 0) {
        hoods = (data.Neighborhood || []).map(hood => hood.data);
      }
      return hoods;
    },

    get categories() {
      return (data.Category || []).map(({ data }) => data.Name).reverse();
    },

    get photos() {
      return (_get(data, 'Attachments.localFiles') || [])
        .map((photo, index) => ({
          fixed: photo.childImageSharp.fixed,
          raw: data.Attachments.raw[index],
        }))
        .reverse();
    },
  };
}

module.exports = getBizPresenter;
