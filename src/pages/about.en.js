import cx from 'classnames';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link as TPLink, Wrap } from '@cocolist/thumbprint-react';
import { ContentActionsCheckSmall } from '@thumbtack/thumbprint-icons';
import Header from '../components/Header';
import Rating from '../components/Rating';
import { badges } from '../lib/badges';
import { parseLangFromURL } from '../lib/i18n';
import styles from './about.module.scss';

const urls = {
  dineGreen: 'http://www.dinegreen.com/certification-standards',
  foodies: 'https://www.facebook.com/groups/foodiesinsaigon/',
  rustyCompass:
    'https://www.rustycompass.com/vietnam-travel-guide-233/ho-chi-minh-city-4/eating-16/plastic-waste-saigon-restaurants-taking-action-to-reduce-plastic-waste-1319',
};

const ListItem = props => (
  <li className="flex mb1">
    <ContentActionsCheckSmall className="green mr2 flex-shrink-0" /> {props.children}
  </li>
);

const Footnote = props => (
  <TPLink to="#footnotes">
    <sup>[{props.index}]</sup>
  </TPLink>
);

const Text = props => (
  <p className={cx(props.className, 'measure-wide mb3')}>{props.children}</p>
);

const About = ({ data, intl: { formatMessage }, location }) => (
  <>
    <Helmet>
      <title>
        Cocolist {formatMessage({ id: 'Saigon' })} &ndash;{' '}
        {formatMessage({
          id: 'header_link_about',
        })}
      </title>
    </Helmet>
    <Header location={location} />
    <Img
      alt="Trash-covered beach in Cam Ranh, Vietnam"
      className={styles.hero}
      fluid={data.file.childImageSharp.fluid}
      objectFit="cover"
      title="Flotsam & jetsam washed up on a Vietnamese beach: much of it is single-use plastic"
    />
    {parseLangFromURL(location.pathname) === 'vi' && (
      <div className="tp-alert tp-alert--banner tp-alert--warning">
        <div className="tp-alert__text">
          Xin lỗi trang này chỉ có sẵn bằng tiếng Anh. Nếu bạn muốn giúp chúng tôi dịch
          nó, hãy gửi email cho chúng tôi theo{' '}
          <a href="mailto:translations@cocolist.vn">translations@cocolist.vn</a> 🙂
        </div>
      </div>
    )}
    <Wrap>
      <article className="pb6">
        <header>
          <h1 className="tp-title-1 mt5 m_mt6 mb0">
            Introducing <span className="green">Cocolist</span>, an app for finding{' '}
            <nobr>eco-conscious</nobr> businesses in Vietnam.
          </h1>
        </header>
        <div className={cx(styles.trash, 'w-100 m_w-33 mt4 ml3')}></div>
        <section className="tp-body-1" id="introduction">
          <Text className="mt5">
            Xin chào! I’m Ben, and I live in Saigon, a vibrant city but with an
            increasingly alarming issue: <i>pollution</i>. While I have taken steps to
            reduce my own eco-footprint, I wanted to do more.
          </Text>
          <Text>
            With a thriving local business community and an increasing awareness in
            Vietnam about environmental issues, there is a growing interest among
            consumers to choose businesses that have taken steps be greener.
          </Text>
          <Text>
            And in fact many business owners are already trying to make an impact by doing
            things like reducing or eliminating single-use plastic, even when it might
            hurt their bottom line. These businesses deserve to be rewarded for their
            actions.
          </Text>
          <Text>
            But how can eco-conscious consumers find eco-conscious businesses? Until now,
            the only way was through word-of-mouth, in Facebook groups
            <Footnote index={1} />
            <Footnote index={2} />, or blogs
            <Footnote index={3} />, but these still have one key problem: there is no
            independent, comprehensive list of eco-conscious businesses.
          </Text>
          <Text>
            That’s why I created <b>Cocolist</b>, Vietnam's first up-to-date directory of
            eco-conscious businesses. Starting specifically with food & beverage
            businesses in Saigon, my goal is to expand into more industries like
            hospitality and health & beauty, and more cities like Da Nang and Hanoi in the
            coming months.
          </Text>
        </section>

        <section className="tp-body-1" id="recognition">
          <h2 className="tp-title-2 mt6 mb5">How it works</h2>
          <h3 className="tp-title-4 mv3">Positive recognition only</h3>
          <Text>
            Every day in Vietnam there are millions of pieces of single-use plastic or
            styrofoam waste generated in food & beverage industry alone. A single bubble
            tea or coffee can use up to 4 separate pieces of plastic: a cup, lid, straw
            and carrier. Local business owners are in a unique position to be game
            changers in this movement.
          </Text>
          <Text>
            At the same time, the reality is that business owners have to take many
            factors into consideration — e.g. profit margins, convenience, and reliability
            — when deciding whether or not to use the eco-friendly packaging that is
            currently available on the market.
          </Text>
          <Text>
            Therefore the goal of Cocolist is to incentivize green business practices by
            giving <u className="underline">positive recognition only</u>, and the data
            being collected reflects that. Along the way, any time a business takes
            another step, the app will recalculate its score (see below) and publish it.
          </Text>
        </section>

        <section className="tp-body-1" id="scoring">
          <h3 className="tp-title-4 mt5 mb3">Business Scoring</h3>

          <Text>
            For the initial data gathering and research phase, Cocolist is using the Green
            Restaurant Association’s Green Restaurant Certification Standards
            <Footnote index={4} /> as a guide for choosing what data points to collect and
            how to evaluate each business's environmental accomplishments. These
            accomplishments are then grouped into categories with a number of
            corresponding badges shown on the business's profile:
          </Text>

          <div className="tp-body-2 pb6">
            <h4 className="tp-title-6 mt4 mb3">Take-out & delivery</h4>
            <ul>
              <ListItem>
                <span style={{ textIndent: '-0.3em' }}>“Bring-your-own container”</span>{' '}
                discount
              </ListItem>
              <ListItem>Plastic-free delivery available</ListItem>
              <ListItem>Single-use plastics reduced or eliminated</ListItem>
            </ul>
            <h4 className="tp-title-6 mt4 mb3">Dine-in</h4>
            <ul>
              <ListItem>Single-use plastics reduced or eliminated</ListItem>
              <ListItem>Reusable napkins, towels, linens, straws, etc.</ListItem>
              <ListItem>Free, refillable water provided</ListItem>
            </ul>
            <h4 className="tp-title-6 mt4 mb3">Kitchen</h4>
            <ul>
              <ListItem>Proper recycling & waste separation</ListItem>
              <ListItem>Food waste management</ListItem>
              <ListItem>Grease traps on sinks</ListItem>
              <ListItem>Green cleaning products</ListItem>
            </ul>
            <h4 className="tp-title-6 mt4 mb3">Menu</h4>
            <ul>
              <ListItem>Local ingredients</ListItem>
              <ListItem>Vegan options</ListItem>
              <ListItem>Vegetarian</ListItem>
              <ListItem>Sustainable seafood</ListItem>
            </ul>
          </div>

          <h3 className="tp-title-4 mb6" id="badges">
            Badges
          </h3>

          <div className="s_flex flex-wrap mv5">
            {badges.map(badge => (
              <div
                className="flex items-center s_flex-column s_items-start s_w-50 m_w-33 pb6 pr4 l_pr6"
                key={badge.title}>
                <img
                  alt=""
                  className="s_mb4 mr4 s_mr0"
                  src={require(`../assets/badges/${badge.imageLarge}`)}
                />
                <div>
                  <h4 className="tp-title-5 mb2">
                    <FormattedMessage id={badge.title} />
                  </h4>
                  <div className="tp-body-2 measure-narrow">
                    <FormattedMessage
                      id={badge.description}
                      values={{
                        business: formatMessage({ id: 'generic_business_name' }),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/*
          <h3 className="tp-title-4 mt5 mb3" id="ratings">
            Ratings
          </h3>

          <Text>
            In addition, next to each businesses name, a rating will appear, indicating
            the degree of their environmental accomplishments, outlined below:
          </Text>

          <table className="w-100 mv5 l_w-80">
            <tbody>
              <tr>
                <td className="pv2 pr4 pl4">
                  <Rating badgeCount={0} points={0} size="small" />
                </td>
                <td className="pa3">
                  <div className="measure">
                    As far as we know, this business hasn’t taken any steps towards
                    environmentally-friendly business practices.
                  </div>
                </td>
              </tr>
              <tr className="bt b-gray-300">
                <td className="pv2 pr4 pl4">
                  <Rating badgeCount={0} points={10} size="small" />
                </td>
                <td className="pa3">
                  <div className="measure">This business has taken some small steps.</div>
                </td>
              </tr>
              <tr className="bt b-gray-300">
                <td className="pv4 pr4 pl4">
                  <Rating badgeCount={1} size="small" />
                  <br />
                  <Rating badgeCount={3} size="small" />
                  <br />
                  <Rating badgeCount={5} size="small" />
                </td>
                <td className="pa3 f5">
                  <div className="measure">
                    This business has shown a commitment to environmentally-friendly
                    business practices by earning one or more badges. The number of green
                    stars corresponds to how many badges they earn, up to 5.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        */}
        </section>

        <section className="tp-body-3" id="footnotes">
          <ul className="mt7">
            <li>
              [1]{' '}
              <TPLink to="https://www.facebook.com/groups/expatshcmc/" shouldOpenInNewTab>
                “Expats in HCMC”
              </TPLink>
              . Facebook.
            </li>
            <li>
              [2]{' '}
              <TPLink to={urls.foodies} shouldOpenInNewTab>
                “Foodies in Saigon”
              </TPLink>
              . Facebook.
            </li>
            <li>
              [3]{' '}
              <TPLink to={urls.rustyCompass} shouldOpenInNewTab>
                “Saigon restaurants taking action to reduce plastic waste”
              </TPLink>
              . Rusty Compass.
            </li>
            <li>
              [4]{' '}
              <TPLink to={urls.dineGreen} shouldOpenInNewTab>
                “Green Restaurant Certification Standards”
              </TPLink>
              . Green Restaurant Association
            </li>
          </ul>
        </section>

        <section id="contact">
          <p className="mt5 mb0 b tp-body-3">
            Inquiries
            <br />
            <a className="link" href="mailto:xinchao@cocolist.vn">
              xinchao@cocolist.vn
            </a>
          </p>
        </section>
      </article>
    </Wrap>
  </>
);

export const query = graphql`
  query {
    file(relativePath: { eq: "trash-in-vietnam.jpg" }) {
      childImageSharp {
        fluid(quality: 90, maxWidth: 4000) {
          ...GatsbyImageSharpFluid_noBase64
        }
      }
    }
  }
`;

export default injectIntl(About);
