import cx from 'classnames';
import { Link } from 'gatsby';
import React, { useState, useEffect, createRef } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  InstantSearch,
  Index,
  Highlight,
  Hits,
  connectStateResults,
  connectSearchBox,
} from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import { NavigationSearchSmall } from '@thumbtack/thumbprint-icons';
import {
  Input,
  InputClearButton,
  InputIcon,
  Link as TPLink,
} from '@cocolist/thumbprint-react';
import { parseLocaleFromURL, getLocalizedURL } from '../lib/i18n';
import styles from './Search.module.scss';

const Results = connectStateResults(
  ({ searchState: state, searchResults: res, children }) =>
    res && res.nbHits > 0 ? (
      children
    ) : (
      <div className="tc pa3 tp-body-2 word-wrap">
        <FormattedMessage id="search_results_none" values={{ query: state.query }} />
      </div>
    ),
);

const Stats = connectStateResults(
  ({ searchResults: res }) =>
    res &&
    (res.nbHits === 1 ? (
      <FormattedMessage id="search_results_count_one" />
    ) : (
      <FormattedMessage id="search_results_count" values={{ count: res.nbHits }} />
    )),
);

const useClickOutside = (ref, handler, events) => {
  if (!events) events = ['mousedown', 'touchstart'];
  const detectClickOutside = event => !ref.current.contains(event.target) && handler();
  useEffect(() => {
    for (const event of events) document.addEventListener(event, detectClickOutside);
    return () => {
      for (const event of events) document.removeEventListener(event, detectClickOutside);
    };
  });
};

const Root = React.forwardRef((props, ref) => <div ref={ref} {...props} />);

let SearchInput = ({ refine, intl: { formatMessage }, ...props }) => {
  const [value, setValue] = useState('');
  return (
    <form>
      <Input
        type="search"
        placeholder={formatMessage({ id: 'search_placeholder' })}
        aria-label={formatMessage({ id: 'search_placeholder' })}
        innerLeft={
          <InputIcon>
            <NavigationSearchSmall />
          </InputIcon>
        }
        innerRight={
          value.length > 0 && (
            <InputClearButton
              onClick={() => {
                setValue('');
                refine('');
              }}
            />
          )
        }
        onChange={value => {
          setValue(value);
          if (value.length === 0 || value.length > 2) {
            refine(value);
          }
        }}
        size="small"
        value={value}
        {...props}
      />
    </form>
  );
};

SearchInput = connectSearchBox(injectIntl(SearchInput));

const PoweredBy = () => (
  <div className="tp-body-3">
    <FormattedMessage
      id="search_powered_by"
      values={{
        link: (
          <TPLink theme="inherit" to="https://algolia.com" shouldOpenInNewTab>
            Algolia
          </TPLink>
        ),
      }}
    />
  </div>
);

const BusinessHit = ({ hit }) => {
  const currentLocale = parseLocaleFromURL(window.location.pathname);
  const linkTo = getLocalizedURL(`/${hit.url}`, currentLocale);
  return (
    <Link className="db pa3 bb b-gray-300" to={linkTo}>
      <div className="tp-title-6 black">
        <Highlight attribute="name" hit={hit} tagName="mark" />
      </div>
      <div className="tp-body-2 black-300">
        <Highlight attribute="category" hit={hit} tagName="mark" />
        <span className="mh2">/</span>
        <Highlight attribute="neighborhood" hit={hit} tagName="mark" />
      </div>
    </Link>
  );
};

const indexName =
  process.env.NODE_ENV === 'development' ? 'DEV_Businesses' : 'PROD_Businesses';

function Search({ collapse }) {
  const ref = createRef();
  const [query, setQuery] = useState(``);
  const [focus, setFocus] = useState(false);
  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY,
  );
  const showResults = query.length > 0 && focus;
  useClickOutside(ref, () => setFocus(false));
  useEffect(() => {
    document.body.style.overflow = showResults ? 'hidden' : '';
  });
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName}
      onSearchStateChange={({ query }) => setQuery(query)}
      root={{ Root, props: { ref } }}>
      <div className="m_relative">
        <SearchInput onFocus={() => setFocus(true)} />
        <div
          className={cx(
            styles.results,
            { dn: !showResults },
            'absolute left-0 bg-white m_ba b-gray-300 w-100',
          )}>
          <div className="flex flex-column w-100 h-100">
            <div
              className={cx(
                'tp-body-3 b-gray-300 ph3 pv1 bb',
                'flex items-center justify-between',
              )}>
              <Stats />
              <PoweredBy />
            </div>
            <div className="flex-auto overflow-auto">
              <Index indexName={indexName}>
                <Results>
                  <Hits hitComponent={BusinessHit} />
                </Results>
              </Index>
            </div>
          </div>
        </div>
      </div>
    </InstantSearch>
  );
}

export default Search;
