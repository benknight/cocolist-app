import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { parseLangFromURL } from '../lib/i18n';

if (!Intl.PluralRules) {
  require('@formatjs/intl-pluralrules/polyfill');
  require('@formatjs/intl-pluralrules/dist/locale-data/en');
  require('@formatjs/intl-pluralrules/dist/locale-data/vi');
}

if (!Intl.RelativeTimeFormat) {
  require('@formatjs/intl-relativetimeformat/polyfill');
  require('@formatjs/intl-relativetimeformat/dist/locale-data/en');
  require('@formatjs/intl-relativetimeformat/dist/locale-data/vi');
}

const IntlProvider = props => {
  const { categories, cities, hoods, tx } = useStaticQuery(graphql`
    {
      tx: allAirtable(filter: { table: { eq: "Translations" } }) {
        edges {
          node {
            data {
              key: Key
              en
              vi
            }
          }
        }
      }
      hoods: allAirtable(filter: { table: { eq: "Neighborhoods" } }) {
        edges {
          node {
            data {
              key: Name
              en: Name
              vi: Name_VI
            }
          }
        }
      }
      cities: allAirtable(filter: { table: { eq: "Cities" } }) {
        edges {
          node {
            data {
              key: Name
              en: Name
              vi: Name_VI
            }
          }
        }
      }
      categories: allAirtable(filter: { table: { eq: "Categories" } }) {
        edges {
          node {
            data {
              key: Name
              en: Name
              vi: Name_VI
            }
          }
        }
      }
    }
  `);
  const lang = parseLangFromURL(props.location.pathname);
  const messages = [
    ...tx.edges,
    ...hoods.edges,
    ...cities.edges,
    ...categories.edges,
  ].reduce((values, currentValue) => {
    const {
      node: { data },
    } = currentValue;
    values[data.key] = data[lang];
    return values;
  }, {});
  return (
    <ReactIntlProvider locale={lang} messages={messages}>
      <>
        <Helmet htmlAttributes={{ lang }} />
        {props.children}
      </>
    </ReactIntlProvider>
  );
};

export default IntlProvider;
