import cx from 'classnames';
import _keyBy from 'lodash/keyBy';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useState, createRef } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  Configure,
  InstantSearch,
  Index,
  InfiniteHits,
  Highlight,
  RefinementList,
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
import { badges } from '../lib/Badges.common';
import { parseLangFromURL, getLocalizedURL } from '../lib/i18n';
import useLocalStorage from '../lib/useLocalStorage';
import CitySelector from './CitySelector';
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

const SearchInput = connectSearchBox(
  injectIntl(({ refine, intl: { formatMessage }, location, size, ...props }) => {
    const [value, setValue] = useState('');
    const [citySelection] = useLocalStorage('citySelection');
    return (
      <form>
        <Input
          type="search"
          placeholder={formatMessage({ id: 'search_placeholder' })}
          aria-label={formatMessage({ id: 'search_placeholder' })}
          innerLeft={
            <InputIcon>
              {size === 'large' ? <NavigationSearchMedium /> : <NavigationSearchSmall />}
            </InputIcon>
          }
          innerRight={
            <div className="flex items-center h-100">
              {value.length > 0 && (
                <InputClearButton
                  onClick={() => {
                    setValue('');
                    refine('');
                  }}
                />
              )}
              {size === 'small' && citySelection && (
                <CitySelector
                  className="dn m_db tp-body-2 pr3"
                  location={location}
                  variant="modal">
                  <FormattedMessage id={citySelection} />
                </CitySelector>
              )}
            </div>
          }
          onChange={value => {
            setValue(value);
            // if (value.length === 0 || value.length > 2) {
            refine(value);
            // }
          }}
          size={size}
          value={value}
          {...props}
        />
      </form>
    );
  }),
);

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
    <Link className="db ph3 pv2 m_pv3 bb b-gray-300 flex items-center" to={linkTo}>
      <div className="flex-auto">
        <div className="tp-title-6 black">
          <Highlight attribute="name" hit={hit} tagName="mark" />{' '}
        </div>
        <div className="tp-body-3 black-300">
          <span className="inline-flex items-center">
            <Highlight attribute={`category_${lang}`} hit={hit} tagName="mark" />
          </span>
        </div>
      </div>
      <div className="nowrap">
        {hit.badges.map(key => {
          const badge = badgesByKey[key];
          return (
            <img
              alt=""
              key={key}
              className="w2 h2 m_w3 m_h3 mr1"
              src={require(`../assets/badges/${badge.imageSmall}`)}
            />
          );
        })}
      </div>
    </Link>
  );
};

function Search({ className, location, size, ...props }) {
  const ref = createRef();
  const lang = parseLangFromURL(location.pathname);
  const [query, setQuery] = useState('');
  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY,
  );
  const showResults = query.length > 0;
  const [citySelection] = useLocalStorage('citySelection');
  const city = props.city || citySelection;
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName}
      onSearchStateChange={({ query }) => setQuery(query || '')}
      root={{ Root, props: { ref } }}>
      {size === 'large' && city && <Configure filters={`cities_en:${city}`} />}
      <div className={cx(className, { [styles.large]: size === 'large' })}>
        <div className="relative z-1">
          <SearchInput location={location} size={size} />
        </div>
        {size === 'large' && (
          <CitySelector className="mt3 tp-body-2" location={location} variant="modal">
            <FormattedMessage id="change_location_label" />
          </CitySelector>
        )}
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
              /> */}
              <RefinementList
                attribute={`neighborhoods_${lang}.${city}`}
                transformItems={items => items.sort((a, b) => b.count - a.count)}
              />
              {/* <RefinementList attribute={`category_${lang}`} /> */}
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
  city: PropTypes.string,
  location: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['small', 'large']).isRequired,
};

export default Search;
