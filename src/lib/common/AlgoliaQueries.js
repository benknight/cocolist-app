const _get = require('lodash/get');
const _groupBy = require('lodash/groupBy');
const _keyBy = require('lodash/keyBy');
const _uniqBy = require('lodash/uniqBy');
const BusinessRenderData = require('./BusinessRenderData');

const businessQuery = `
{
  businesses: allAirtable(filter: { table: { eq: "Businesses" } }) {
    edges {
      node {
        data {
          Record_ID
          Name
          URL_key
          Category {
            data {
              Name
            }
          }
          Neighborhood {
            data {
              Name
              City {
                data {
                  Name
                }
              }
            }
          }
          Locations {
            data {
              Name
              Neighborhood {
                data {
                  Name
                  City {
                    data {
                      Name
                    }
                  }
                }
              }
            }
          }
          Survey {
            data {
              Coco_points
              BYO_container_discount
              No_plastic_bags
              No_plastic_straws
              No_plastic_bottles
              Green_delivery
              Free_drinking_water
              Status
              Kitchen_points
              Food_waste_programs
            }
          }
        }
      }
    }
  }
  translations: allAirtable(filter: { table: { eq: "Messages" } }) {
    edges {
      node {
        data {
          Key
          en
          vi
          km
        }
      }
    }
  }
  cities: allAirtable(
    filter: { table: { eq: "Cities" } }
  ) {
    edges {
      node {
        data {
          Name
        }
      }
    }
  }
}
`;

const settings = {}; // { attributesToSnippet: [`excerpt:20`] }

function flatten(data) {
  const tx = _keyBy(
    data.translations.edges.map(({ node: { data } }) => data),
    'Key',
  );
  return data.businesses.edges.map(({ node: { data } }) => {
    const biz = new BusinessRenderData(data);
    const hoodsByCity = _groupBy(biz.neighborhoods, 'City[0].data.Name');
    const cities = _uniqBy(
      biz.neighborhoods.map(hood => hood.City[0].data),
      'Name',
    );
    return {
      objectID: data.Record_ID,
      slug: data.URL_key,
      name: data.Name,
      coco_points: _get(biz.survey, 'Coco_points') || 0,
      badges: biz.badges.map(badge => badge.key),
      badge_count: biz.badges.length,
      badges_en: biz.badges.map(badge => tx[badge.title].en),
      badges_vi: biz.badges.map(badge => tx[badge.title].vi),
      badges_km: biz.badges.map(badge => tx[badge.title].km),
      category_en: data.Category.map(cat => tx[cat.data.Name].en),
      category_vi: data.Category.map(cat => tx[cat.data.Name].vi),
      category_km: data.Category.map(cat => tx[cat.data.Name].km),
      cities_en: cities.map(city => tx[city.Name].en),
      cities_vi: cities.map(city => tx[city.Name].vi),
      cities_km: cities.map(city => tx[city.Name].km),
      neighborhoods_en: Object.keys(hoodsByCity).reduce((result, city) => {
        result[city] = hoodsByCity[city].map(hood => tx[hood.Name].en);
        return result;
      }, {}),
      neighborhoods_vi: Object.keys(hoodsByCity).reduce((result, city) => {
        result[city] = hoodsByCity[city].map(hood => tx[hood.Name].vi);
        return result;
      }, {}),
      neighborhoods_km: Object.keys(hoodsByCity).reduce((result, city) => {
        result[city] = hoodsByCity[city].map(hood => tx[hood.Name].km);
        return result;
      }, {}),
    };
  });
}

const queries = [
  {
    query: businessQuery,
    transformer: ({ data }) => flatten(data),
    indexName: 'Businesses',
    settings,
  },
];

exports.flatten = flatten;
exports.queries = queries;
