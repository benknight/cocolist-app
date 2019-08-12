import cx from 'classnames';
import _keyBy from 'lodash/keyBy';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useState, createRef } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  InstantSearch,
  Index,
  InfiniteHits,
  Highlight,
  // RefinementList,
  connectStateResults,
  connectSearchBox,
} from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import {
  NavigationSearchMedium,
  NavigationSearchSmall,
} from '@thumbtack/thumbprint-icons';
import {
  Input,
  InputClearButton,
  InputIcon,
  Link as TPLink,
} from '@cocolist/thumbprint-react';
import { badges } from '../lib/badges';
import { parseLangFromURL, getLocalizedURL } from '../lib/i18n';
import styles from './Search.module.scss';

const badgesByKey = _keyBy(badges, 'key');
const indexName = 'Businesses';

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
            {props.size === 'large' ? (
              <NavigationSearchMedium />
            ) : (
              <NavigationSearchSmall />
            )}
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
          // if (value.length === 0 || value.length > 2) {
          refine(value);
          // }
        }}
        size={props.size}
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
  const lang = parseLangFromURL(window.location.pathname);
  const linkTo = getLocalizedURL(`/${hit.slug}`, lang);
  return (
    <Link className="db ph3 pv2 m_pv3 bb b-gray-300" to={linkTo}>
      <div className="tp-title-6 black">
        <Highlight attribute="name" hit={hit} tagName="mark" />{' '}
        {hit.badges.map(key => {
          const badge = badgesByKey[key];
          return (
            <img
              alt=""
              key={key}
              className="w1 h1 mr1"
              src={require(`../assets/badges/${badge.imageSmall}`)}
            />
          );
        })}
      </div>
      <div className="tp-body-3 black-300">
        <Highlight attribute={`category_${lang}`} hit={hit} tagName="mark" />
        <span className="mh2">/</span>
        <Highlight attribute={`neighborhood_${lang}`} hit={hit} tagName="mark" />
      </div>
    </Link>
  );
};

function Search({ className, location, size }) {
  const ref = createRef();
  // const lang = parseLangFromURL(location.pathname);
  const [query, setQuery] = useState('');
  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY,
  );
  const showResults = query.length > 0;
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName}
      onSearchStateChange={({ query }) => setQuery(query)}
      root={{ Root, props: { ref } }}>
      <div className={cx(className, { [styles.large]: size === 'large' })}>
        <div className="relative z-1">
          <SearchInput size={size} />
        </div>
        <div
          className={cx(
            styles.results,
            { dn: !showResults },
            'bg-gray-200 m_br3 overflow-hidden shadow-1',
          )}>
          <div className="flex flex-column">
            <div className="tp-body-3 bb b-gray-300">
              <div className="black-300 ph3 flex items-center mv1 m_mt0">
                <div className="flex-auto">{query && query.length > 0 && <Stats />}</div>
                <PoweredBy />
              </div>
              {/* <RefinementList
                attribute={`badges_${lang}`}
                transformItems={items => items.sort((a, b) => b.count - a.count)}
              />
              <RefinementList
                attribute={`neighborhood_${lang}`}
                transformItems={items => items.sort((a, b) => b.count - a.count)}
              />
              <RefinementList attribute={`category_${lang}`} /> */}
            </div>
            <div
              className={cx(styles.hitsWrapper, 'flex-auto overflow-auto bg-white')}
              style={{ WebkitOverflowScrolling: 'touch' }}>
              <Index indexName={indexName}>
                <Results>
                  <InfiniteHits hitComponent={BusinessHit} />
                </Results>
              </Index>
            </div>
          </div>
        </div>
      </div>
    </InstantSearch>
  );
}

Search.propTypes = {
  className: PropTypes.string,
  location: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['small', 'large']).isRequired,
};

export default Search;
