import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Wrap } from '@thumbtack/thumbprint-react';
import OPGPreviewImage from '../assets/og-preview.jpg';
import CitySelector from '../components/CitySelector';
import Header from '../components/Header';
import { getLocalizedURL } from '../lib/common/i18n';

const metaDescription = `Find restaurants in Cambodia with plastic-free delivery, discounts for customers who bring their own containers, or free drinking water.`;

const Index = ({ intl: { formatMessage }, location, pageContext: { langKey } }) => {
  const pageTitle = formatMessage(
    {
      id: 'find_businesses_headline',
    },
    { city: formatMessage({ id: 'Cambodia' }) },
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
      <Header location={location} showLocationToggle={false} showSearch={false} />
      <Wrap>
        <div className="mv4 m_mv5">
          <div className="tc">
            <div className="tp-title-2 green">{pageTitle}</div>
            <div className="tp-title-4 mv4">
              <FormattedMessage id="select_city_label" />
            </div>
          </div>
          <CitySelector
            include={['phnompenh', 'siemreap', 'kampot', 'sihanoukville', 'battambang']}
            location={location}
          />
        </div>
      </Wrap>
    </>
  );
};

export default injectIntl(Index);
