import Img from 'gatsby-image';
import React from 'react';
import { useIntl } from 'react-intl';

export default function BusinessCard({ biz }) {
  const { formatMessage } = useIntl();
  const cover = (
    <Img
      alt={formatMessage({ id: 'cover_photo_alt_text' }, { biz: biz.name })}
      className="br2 overflow-hidden"
      fluid={biz.coverPhoto}
      objectFit="contain"
    />
  );
  if (!biz.profilePhoto) {
    return cover;
  }
  return (
    <div className="relative">
      {cover}
      <Img
        alt={formatMessage({ id: 'profile_photo_alt_text' }, { biz: biz.name })}
        className="br-pill overflow-hidden absolute top-0 left-0 w-33 h-auto mt2 ml2 shadow-1"
        fluid={biz.profilePhoto}
        objectFit="contain"
      />
    </div>
  );
}
