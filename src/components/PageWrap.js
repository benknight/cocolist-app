import { graphql, StaticQuery } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import vi from 'react-intl/locale-data/vi';
import { parseLangFromURL } from '../lib/i18n';

addLocaleData([...en, ...vi]);

const PageWrap = props => (
  <StaticQuery
    query={graphql`
      {
        allAirtable(filter: { table: { eq: "Translations" } }) {
          edges {
            node {
              data {
                Key
                en
                vi
              }
            }
          }
        }
      }
    `}
    render={({ allAirtable: { edges } }) => {
      const lang = parseLangFromURL(props.location.pathname);
      const messages = edges.reduce((values, currentValue) => {
        const {
          node: { data },
        } = currentValue;
        values[data.Key] = data[lang];
        return values;
      }, {});
      return (
        <IntlProvider locale={lang} messages={messages}>
          <>
            <Helmet htmlAttributes={{ lang }} />
            {props.children}
          </>
        </IntlProvider>
      );
    }}
  />
);

export default PageWrap;
