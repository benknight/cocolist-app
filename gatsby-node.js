/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path');
const _ = require('lodash');

require('dotenv').config();

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const { data } = await graphql(`
    {
      businesses: allAirtable(filter: { table: { eq: "Businesses" } }) {
        edges {
          node {
            data {
              URL_key
            }
          }
        }
      }
      cities: allAirtable(filter: { table: { eq: "Cities" } }) {
        edges {
          node {
            data {
              Name
            }
          }
        }
      }
    }
  `);

  const bizFiltered = data.businesses.edges.filter(
    edge => !!_.get(edge, 'node.data.URL_key'),
  );

  const bizGrouped = _.groupBy(bizFiltered, 'node.data.URL_key');

  let hasDuplicates = false;

  Object.keys(bizGrouped).forEach(key => {
    if (bizGrouped[key].length > 1) {
      hasDuplicates = true;
      console.error(`Duplicate URL_key fields found for string "${key}"`);
    }
  });

  if (hasDuplicates) {
    process.exit(1);
  }

  const BusinessPage = path.resolve('./src/templates/BusinessPage.js');

  bizFiltered.forEach(({ node }) => {
    // English
    createPage({
      path: node.data.URL_key,
      component: BusinessPage,
      context: {
        langKey: 'en',
        slug: node.data.URL_key,
      },
    });
    // Vietnamese
    createPage({
      path: `vi/${node.data.URL_key}`,
      component: BusinessPage,
      context: {
        langKey: 'vi',
        slug: node.data.URL_key,
      },
    });
  });

  const CityPage = path.resolve('./src/templates/CityPage.js');
  const ListPage = path.resolve('./src/templates/ListPage.js');

  const listPages = [
    'byoc',
    'green-delivery',
    'food-waste',
    'vegetarian',
    'green-kitchen',
    'no-plastic-bags',
    'no-plastic-bottles',
    'no-plastic-straws',
    'free-drinking-water',
  ];

  data.cities.edges.forEach(({ node: { data: city } }) => {
    const citySlug = city.Name.toLowerCase();

    createPage({
      path: citySlug,
      component: CityPage,
      context: {
        langKey: 'en',
        city: city.Name,
        slug: citySlug,
      },
    });

    createPage({
      path: `vi/${citySlug}`,
      component: CityPage,
      context: {
        langKey: 'vi',
        city: city.Name,
        slug: citySlug,
      },
    });

    // Create list pages for city
    listPages.forEach(listSlug => {
      createPage({
        path: `${citySlug}/${listSlug}`,
        component: ListPage,
        context: {
          langKey: 'en',
          city: city.Name,
          slug: listSlug,
        },
      });
      createPage({
        path: `vi/${citySlug}/${listSlug}`,
        component: ListPage,
        context: {
          langKey: 'vi',
          city: city.Name,
          slug: listSlug,
        },
      });
    });
  });
};

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;
  deletePage(page);
  const enPage = {
    ...page,
    context: {
      ...page.context,
      langKey: 'en',
    },
  };
  const viPage = {
    ...page,
    path: `/vi${page.path}`,
    context: {
      ...page.context,
      langKey: 'vi',
    },
  };
  // console.log(enPage, viPage);
  createPage(enPage);
  createPage(viPage);
};
