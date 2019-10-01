const _get = require('lodash/get');

// Reminder: order determines display order
const badges = [
  {
    key: 'plasticFreeDelivery',
    imageSmall: 'plastic-free-delivery-small.svg',
    imageLarge: 'plastic-free-delivery.svg',
    imageLargeAlt: 'plastic-free-delivery-alt.svg',
    title: 'green_delivery_label',
    description: 'green_delivery_description',
    test: survey => {
      const always = survey.Green_delivery === '100% plastic-free';
      const reduced = survey.Green_delivery === 'Reduced plastic';
      return always || reduced;
    },
    linkTarget: '/green-delivery',
  },
  {
    key: 'byoc',
    imageSmall: 'BYOC-small.svg',
    imageLarge: 'BYOC.svg',
    imageLargeAlt: 'BYOC-alt.svg',
    title: 'byoc_discount_label',
    description: 'byoc_discount_description',
    test: survey => !!survey.BYO_container_discount,
    linkTarget: '/byoc',
  },
  {
    key: 'vegetarian',
    imageSmall: 'vegetarian-small.svg',
    imageLarge: 'vegetarian.svg',
    imageLargeAlt: 'vegetarian-alt.svg',
    title: 'menu_vegetarian_label',
    description: 'menu_vegetarian_description',
    test: survey => {
      const menu = _get(survey, 'Menu', []);
      return (
        menu.indexOf('Vegetarian menu') !== -1 || menu.indexOf('Plant-based menu') !== -1
      );
    },
    linkTarget: '/vegetarian',
  },
  {
    key: 'refill',
    imageSmall: 'water-refill-small.svg',
    imageLarge: 'water-refill.svg',
    imageLargeAlt: 'water-refill-alt.svg',
    title: 'refill_my_bottle_label',
    description: 'refill_my_bottle_description',
    test: survey => !!survey.Free_drinking_water,
    linkTarget: '/free-drinking-water',
  },
  {
    key: 'foodWaste',
    imageSmall: 'food-waste-mgmt-small.svg',
    imageLarge: 'food-waste-mgmt.svg',
    imageLargeAlt: 'food-waste-mgmt-alt.svg',
    title: 'food_waste_program_label',
    description: 'food_waste_program_description',
    test: survey => _get(survey, 'Food_waste_programs', []).length > 0,
    linkTarget: '/food-waste',
  },
  {
    key: 'kitchen',
    imageSmall: 'kitchen-small.svg',
    imageLarge: 'kitchen.svg',
    imageLargeAlt: 'kitchen-alt.svg',
    title: 'green_kitchen_label',
    description: 'green_kitchen_description',
    test: survey => _get(survey, 'Kitchen_points', 0) > 3,
    linkTarget: '/green-kitchen',
  },
  {
    key: 'noPlasticStraws',
    imageSmall: 'no-plastic-straws-small.svg',
    imageLarge: 'no-plastic-straws.svg',
    imageLargeAlt: 'no-plastic-straws-alt.svg',
    title: 'no_plastic_straws_label',
    description: 'no_plastic_straws_description',
    test: survey => !!survey.No_plastic_straws,
    linkTarget: '/no-plastic-straws',
  },
  {
    key: 'noPlasticBags',
    imageSmall: 'no-plastic-bags-small.svg',
    imageLarge: 'no-plastic-bags.svg',
    imageLargeAlt: 'no-plastic-bags-alt.svg',
    title: 'no_plastic_bags_label',
    description: 'no_plastic_bags_description',
    test: survey => !!survey.No_plastic_bags,
    linkTarget: '/no-plastic-bags',
  },
  {
    key: 'noPlasticBottles',
    imageSmall: 'no-plastic-bottles-small.svg',
    imageLarge: 'no-plastic-bottles.svg',
    imageLargeAlt: 'no-plastic-bottles-alt.svg',
    title: 'no_plastic_bottles_label',
    description: 'no_plastic_bottles_description',
    test: survey => !!survey.No_plastic_bottles,
    linkTarget: '/no-plastic-bottles',
  },
];

function getBadgesFromSurvey(survey) {
  return badges.filter(badge => badge.test(survey));
}

module.exports = {
  badges,
  getBadgesFromSurvey,
};
