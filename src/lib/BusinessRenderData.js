import _get from 'lodash/get';
import React from 'react';
import { SocialFacebookSmall } from '@thumbtack/thumbprint-icons';
import gmapsLogo from '../assets/gmaps-logo.svg';
import messengerLogo from '../assets/messenger-logo.svg';
import vnmmLogo from '../assets/vnmm-logo.svg';
import { getLocalizedURL, getLocalizedVNMMURL } from '../lib/i18n';
import { getBadgesFromSurvey } from './badges';

class BusinessRenderData {
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

  get thumbnail() {
    return _get(this.data, 'Profile_photo.localFiles[0].childImageSharp.fluid');
  }

  get name() {
    return this.data.Name;
  }

  get survey() {
    return (this.data.F_B_survey || [])
      .map(({ data }) => data)
      .find(({ Status }) => Status === 'Published');
  }

  get badges() {
    if (this.survey) {
      return getBadgesFromSurvey(this.survey);
    }
    return [];
  }

  get neighborhoods() {
    return this.data.Neighborhood.map(({ data }) => data.Name);
  }

  get categories() {
    return this.data.Category.map(({ data }) => data.Name);
  }

  get photos() {
    return this.data.Business_photos.localFiles.map((photo, index) => ({
      fixed: photo.childImageSharp.fixed,
      raw: this.data.Business_photos.raw[index],
    }));
  }

  get links() {
    const links = [];
    if (this.data.Google_Maps_link) {
      links.push([
        'Google_Maps_link',
        this.data.Google_Maps_link.split(',')[0].trim(),
        <img alt="Google Maps logo" className="w1 h1" src={gmapsLogo} />,
      ]);
    }
    if (this.data.Facebook_link) {
      links.push([
        'Facebook_link',
        this.data.Facebook_link.split(',')[0].trim(),
        <SocialFacebookSmall />,
      ]);
      links.push([
        'Messenger_link',
        this.data.Facebook_link.split(',')[0]
          .trim()
          .replace('facebook.com', 'm.me'),
        <img alt="Messenger logo" className="w1 h1" src={messengerLogo} />,
      ]);
    }
    if (this.data.VNMM_link) {
      links.push([
        'VNMM_link',
        getLocalizedVNMMURL(this.data.VNMM_link.split(',')[0], this.langKey),
        <img alt="VietnamMM logo" className="w1 h1" src={vnmmLogo} />,
      ]);
    }
    return links;
  }
}

export default BusinessRenderData;
