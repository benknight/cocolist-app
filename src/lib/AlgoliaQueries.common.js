const _get = require('lodash/get');
const _groupBy = require('lodash/groupBy');
const _keyBy = require('lodash/keyBy');
const _uniqBy = require('lodash/uniqBy');
const { getBadgesFromSurvey } = require('./Badges.common');

const businessQuery = `
{
  businesses: allAirtable(filter: { table: { eq: "Businesses" } }) {
    edges {
      node {
        data {
          Record_ID
          Name
          URL_key
          VNMM_rating_count
          Category {
            data {
              Name
              Name_VI
            }
          }
          Neighborhood {
            data {
              Name
              Name_VI
              City {
                data {
                  Name
                  Name_VI
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
                  Name_VI
                  City {
                    data {
                      Name
                      Name_VI
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
    const fbSurvey = (data.Survey || [])
      .map(({ data }) => data)
      .find(({ Status }) => Status === 'Published');
    const badges = fbSurvey ? getBadgesFromSurvey(fbSurvey) : [];
    // First check for location data, and fall back to static neighborhoods field.
    let hoods = _uniqBy(
      data.Locations.map(({ data }) => data.Neighborhood[0].data),
      'Name',
    );
    if (hoods.length === 0) {
      hoods = data.Neighborhood.map(hood => hood.data);
    }
    const hoodsByCity = _groupBy(hoods, 'City[0].data.Name');
    const cities = _uniqBy(
      hoods.map(hood => hood.City[0].data),
      'Name',
    );
    return {
      objectID: data.Record_ID,
      slug: data.URL_key,
      name: data.Name,
      coco_points: _get(fbSurvey, 'Coco_points') || 0,
      vnmm_rating_count: data.VNMM_rating_count || 0,
      badges: badges.map(badge => badge.key),
      badge_count: badges.length,
      badges_en: badges.map(badge => tx[badge.title].en),
      badges_vi: badges.map(badge => tx[badge.title].vi),
      category_en: data.Category.map(cat => cat.data.Name),
      category_vi: data.Category.map(cat => cat.data.Name_VI),
      cities_en: cities.map(city => city.Name),
      cities_vi: cities.map(city => city.Name_VI),
      neighborhoods_en: Object.keys(hoodsByCity).reduce((result, city) => {
        result[city] = hoodsByCity[city].map(hood => hood.Name);
        return result;
      }, {}),
      neighborhoods_vi: Object.keys(hoodsByCity).reduce((result, city) => {
        result[city] = hoodsByCity[city].map(hood => hood.Name_VI);
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
