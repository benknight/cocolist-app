const _get = require('lodash/get');

// Order determines display order
const badges = [
  {
    key: 'plasticFreeDelivery',
    imageSmall: 'plastic-free-delivery-small.svg',
    imageLarge: 'plastic-free-delivery-alt.svg',
    title: 'plastic_free_delivery_label',
    description: 'plastic_free_delivery_description',
    test: survey =>
      ['Always', 'Available on request'].indexOf(survey.Plastic_free_delivery) !== -1,
  },
  {
    key: 'noPlasticStraws',
    imageSmall: 'no-plastic-straws-small.svg',
    imageLarge: 'no-plastic-straws-alt.svg',
    title: 'no_plastic_straws_label',
    description: 'no_plastic_straws_description',
    test: survey => !!survey.No_plastic_straws,
  },
  {
    key: 'noPlasticBags',
    imageSmall: 'no-plastic-bags-small.svg',
    imageLarge: 'no-plastic-bags-alt.svg',
    title: 'no_plastic_bags_label',
    description: 'no_plastic_bags_description',
    test: survey => !!survey.No_plastic_bags,
  },
  {
    key: 'byoc',
    imageSmall: 'BYOC-small.svg',
    imageLarge: 'BYOC-alt.svg',
    title: 'byoc_discount_label',
    description: 'byoc_discount_description',
    test: survey => !!survey.BYO_container_discount,
  },
  {
    key: 'refill',
    imageSmall: 'water-refill-small.svg',
    imageLarge: 'water-refill-alt.svg',
    title: 'refill_my_bottle_label',
    description: 'refill_my_bottle_description',
    test: survey => !!survey.Refill_my_bottle,
  },
  {
    key: 'foodWaste',
    imageSmall: 'food-waste-mgmt-small.svg',
    imageLarge: 'food-waste-mgmt-alt.svg',
    title: 'food_waste_program_label',
    description: 'food_waste_program_description',
    test: survey => _get(survey, 'Food_waste_programs', []).length > 0,
  },
  {
    key: 'kitchen',
    imageSmall: 'kitchen-small.svg',
    imageLarge: 'kitchen-alt.svg',
    title: 'green_kitchen_label',
    description: 'green_kitchen_description',
    test: survey => _get(survey, 'Kitchen_points', 0) > 3,
  },
];

function getBadgesFromSurvey(survey) {
  return badges.filter(badge => badge.test(survey));
}

module.exports = {
  badges,
  getBadgesFromSurvey,
};
