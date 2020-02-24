import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Wrap } from '@thumbtack/thumbprint-react';
import OPGPreviewImage from '../assets/og-preview.jpg';
import CitySelector from '../components/CitySelector';
import Header from '../components/Header';
import { getLocalizedURL } from '../lib/common/i18n';

const metaDescription = `Find restaurants in your city with plastic-free delivery, discounts for customers who bring their own containers, or free drinking water.`;

const Index = ({ intl: { formatMessage }, location, pageContext: { langKey } }) => {
  const pageTitle = formatMessage(
    {
      id: 'find_businesses_headline',
    },
    { city: formatMessage({ id: 'your_city' }) },
  );
  return (
    <>
      <Helmet>
        <title>Cocolist &ndash; {pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="fb:app_id" content="375503033345734" />
        <meta property="og:title" content={`Cocolist – ${pageTitle}`} />
        <meta property="og:image" content={`https://cocolist.app${OPGPreviewImage}`} />
        <meta
          property="og:url"
          content={`https://cocolist.app${getLocalizedURL('/', langKey)}`}
        />
        <meta property="og:description" content={metaDescription} />
        <meta
          property="twitter:card"
          content={`https://cocolist.app${OPGPreviewImage}`}
        />
      </Helmet>
      <Header location={location} showSearch={false} />
      <Wrap>
        <div className="mv4 m_mv5">
          <div className="tp-title-2 tc">
            <FormattedMessage id="select_city_label" />
          </div>
          <CitySelector location={location} />
          {langKey === 'en' && (
            <div className="tp-body-2 tc mv4">
              Don't see your city here?{' '}
              <a href="mailto:partners@cocolist.app">Help us add it!</a>{' '}
              <div className="dib">
                We're currently looking for partners in Bali, Chiang Mai.
              </div>
            </div>
          )}
        </div>
      </Wrap>
    </>
  );
};

export default injectIntl(Index);
