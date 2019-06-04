const _get = require('lodash/get');
const _keyBy = require('lodash/keyBy');
const { getBadgesFromSurvey } = require('./badges');

const businessQuery = `
  {
    businesses: allAirtable(filter: { table: { eq: "Businesses" } }) {
      edges {
        node {
          data {
            Name
            Type
            URL_Key
            VNMM_Rating_Count
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
                Coco_Points
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
    translations: allAirtable(filter: { table: { eq: "Translations" } }) {
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
`;

const settings = {}; // { attributesToSnippet: [`excerpt:20`] }

const flatten = data => {
  const tx = _keyBy(data.translations.edges.map(({ node: { data } }) => data), 'Key');
  return data.businesses.edges.map(({ node: { data } }) => {
    const fbSurvey = (data.F_B_Survey || [])
      .map(({ data }) => data)
      .find(({ Status }) => Status === 'Published');
    const badges = fbSurvey ? getBadgesFromSurvey(fbSurvey) : [];
    return {
      name: data.Name,
      type: _get(data, 'Type[0]'),
      coco_points: _get(fbSurvey, 'Coco_Points') || 0,
      vnmm_rating_count: data.VNMM_Rating_Count || 0,
      badges_en: badges.map(badge => tx[badge.title].en),
      badges_vi: badges.map(badge => tx[badge.title].vi),
      category_en: data.Category.map(cat => tx[cat.data.Name].en),
      category_vi: data.Category.map(cat => tx[cat.data.Name].vi),
      neighborhood_en: data.Neighborhood.map(hood => tx[hood.data.Name].en),
      neighborhood_vi: data.Neighborhood.map(hood => tx[hood.data.Name].vi),
      slug: data.URL_Key,
    };
  });
};

const queries = [
  {
    query: businessQuery,
    transformer: ({ data }) => flatten(data),
    indexName: 'Businesses',
    settings,
  },
];

module.exports = queries;
