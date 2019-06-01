const _ = require('lodash');

const businessQuery = `
  {
    allAirtable(filter: { table: { eq: "Businesses" } }) {
      edges {
        node {
          data {
            Name
            URL_Key
            Category {
              data {
                Name
              }
            }
            Neighborhood {
              data {
                Name
              }
            }
            F_B_Survey {
              data {
                BYO_container_discount
                No_plastic_bags
                No_plastic_straws
                Plastic_free_delivery
                Refill_my_bottle
                Status
              }
            }
          }
        }
      }
    }
  }
`;

const settings = {}; // { attributesToSnippet: [`excerpt:20`] }

const flatten = edges =>
  edges.map(({ node: { data } }) => {
    const fbSurvey = (data.F_B_Survey || [])
      .map(({ data }) => data)
      .find(({ Status }) => Status === 'Published');
    return {
      category: data.Category.map(cat => cat.data.Name),
      name: data.Name,
      neighborhood: data.Neighborhood.map(hood => hood.data.Name),
      survey: _.pick(fbSurvey || {}, [
        'BYO_container_discount',
        'No_plastic_bags',
        'No_plastic_straws',
        'Plastic_free_delivery',
        'Refill_my_bottle',
      ]),
      url: data.URL_Key,
    };
  });

const envPrefix = process.env.BUILD_DEV ? 'DEV_' : 'PROD_';

const queries = [
  {
    query: businessQuery,
    transformer: ({ data }) => flatten(data.allAirtable.edges),
    indexName: `${envPrefix}Businesses`,
    settings,
  },
];

module.exports = queries;
