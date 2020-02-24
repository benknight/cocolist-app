const _get = require('lodash/get');
const _uniqBy = require('lodash/uniqBy');
const { getLocalizedURL } = require('./i18n');
const { getBadgesFromSurvey } = require('./Badges');

class SurveyRenderData {
  constructor(data, langKey) {
    this.data = data; // Airtable data
    this.langKey = langKey;
  }

  get id() {
    return this.data.Record_ID;
  }

  get url() {
    return getLocalizedURL(`/${this.data.URL_key}`, this.langKey);
  }

  get coverPhoto() {
    return _get(this.data, 'Cover_photo.localFiles[0].childImageSharp.fluid');
  }

  get profilePhoto() {
    return _get(this.data, 'Profile_photo.localFiles[0].childImageSharp.fluid');
  }

  get name() {
    return this.data.Name;
  }

  get badges() {
    return getBadgesFromSurvey(this.data);
  }

  get cities() {
    const cities = _uniqBy(
      this.neighborhoods.map(hood => hood.City[0].data),
      'Name',
    );
    return cities;
  }

  get neighborhoods() {
    let hoods = _uniqBy(
      (this.data.Locations || [])
        .filter(({ data }) => !!_get(data, 'Neighborhood[0].data.Name'))
        .map(({ data }) => data.Neighborhood[0].data),
      'Name',
    );
    if (hoods.length === 0) {
      hoods = (this.data.Neighborhood || []).map(hood => hood.data);
    }
    return hoods;
  }

  get categories() {
    return (this.data.Category || []).map(({ data }) => data.Name).reverse();
  }

  get photos() {
    return (_get(this.data, 'Attachments.localFiles') || [])
      .map((photo, index) => ({
        fixed: photo.childImageSharp.fixed,
        raw: this.data.Attachments.raw[index],
      }))
      .reverse();
  }

  get cocoPoints() {
    return this.data.Coco_points;
  }
}

module.exports = SurveyRenderData;
