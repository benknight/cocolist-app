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

  const result = await graphql(`
    {
      allAirtable(filter: { table: { eq: "Businesses" } }) {
        edges {
          node {
            data {
              URL_Key
            }
          }
        }
      }
    }
  `);

  const filtered = result.data.allAirtable.edges.filter(
    edge => !!_.get(edge, 'node.data.URL_Key'),
  );

  const grouped = _.groupBy(filtered, 'node.data.URL_Key');

  let hasDuplicates = false;

  Object.keys(grouped).forEach(key => {
    if (grouped[key].length > 1) {
      hasDuplicates = true;
      console.error(`Duplicate URL_Key fields found for string "${key}"`);
    }
  });

  if (hasDuplicates) {
    process.exit(1);
  }

  filtered.forEach(({ node }) => {
    // English
    createPage({
      path: node.data.URL_Key,
      component: path.resolve('./src/templates/BusinessPage.js'),
      context: {
        slug: node.data.URL_Key,
      },
    });
    // Vietnamese
    createPage({
      path: `vi/${node.data.URL_Key}`,
      component: path.resolve('./src/templates/BusinessPage.js'),
      context: {
        slug: node.data.URL_Key,
      },
    });
  });
};
