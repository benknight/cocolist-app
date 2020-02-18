import Img from 'gatsby-image';
import React from 'react';

export default function BusinessCard({ biz }) {
  const cover = (
    <Img
      alt={`Cover photo of ${biz.name}`}
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
        alt={`Profile photo of ${biz.name}`}
        className="br-pill overflow-hidden absolute top-0 left-0 w-33 h-auto mt2 ml2 shadow-1"
        fluid={biz.profilePhoto}
        objectFit="contain"
      />
    </div>
  );
}
