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

  const businessPageQuery = await graphql(`
    {
      allAirtable(filter: { table: { eq: "Businesses" } }) {
        edges {
          node {
            data {
              URL_key
            }
          }
        }
      }
    }
  `);

  const filtered = businessPageQuery.data.allAirtable.edges.filter(
    edge => !!_.get(edge, 'node.data.URL_key'),
  );

  const grouped = _.groupBy(filtered, 'node.data.URL_key');

  let hasDuplicates = false;

  Object.keys(grouped).forEach(key => {
    if (grouped[key].length > 1) {
      hasDuplicates = true;
      console.error(`Duplicate URL_key fields found for string "${key}"`);
    }
  });

  if (hasDuplicates) {
    process.exit(1);
  }

  const BusinessPage = path.resolve('./src/templates/BusinessPage.js');

  filtered.forEach(({ node }) => {
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
      path: `/vi/${node.data.URL_key}`,
      component: BusinessPage,
      context: {
        langKey: 'vi',
        slug: node.data.URL_key,
      },
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
