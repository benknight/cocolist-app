const _get = require('lodash/get');

const badges = {
  BYOC: {
    imageSmall: 'BYOC-small.svg',
    imageLarge: 'BYOC-alt.svg',
    title: 'byoc_discount_label',
    description: 'byoc_discount_description',
  },
  foodWaste: {
    imageSmall: 'food-waste-mgmt-small.svg',
    imageLarge: 'food-waste-mgmt-alt.svg',
    title: 'food_waste_program_label',
    description: 'food_waste_program_description',
  },
  kitchen: {
    imageSmall: 'kitchen-small.svg',
    imageLarge: 'kitchen-alt.svg',
    title: 'green_kitchen_label',
    description: 'green_kitchen_description',
  },
  noPlasticBags: {
    imageSmall: 'no-plastic-bags-small.svg',
    imageLarge: 'no-plastic-bags-alt.svg',
    title: 'no_plastic_bags_label',
    description: 'no_plastic_bags_description',
  },
  noPlasticStraws: {
    imageSmall: 'no-plastic-straws-small.svg',
    imageLarge: 'no-plastic-straws-alt.svg',
    title: 'no_plastic_straws_label',
    description: 'no_plastic_straws_description',
  },
  plasticFreeDelivery: {
    imageSmall: 'plastic-free-delivery-small.svg',
    imageLarge: 'plastic-free-delivery-alt.svg',
    title: 'plastic_free_delivery_label',
    description: 'plastic_free_delivery_description',
  },
  refill: {
    imageSmall: 'water-refill-small.svg',
    imageLarge: 'water-refill-alt.svg',
    title: 'refill_my_bottle_label',
    description: 'refill_my_bottle_description',
  },
};

exports.getBadgesFromSurvey = function(fbSurvey) {
  const result = [];
  if (_get(fbSurvey, 'No_plastic_straws')) {
    result.push(badges.noPlasticStraws);
  }
  if (_get(fbSurvey, 'No_plastic_bags')) {
    result.push(badges.noPlasticBags);
  }
  if (
    ['Always', 'Available on request'].indexOf(
      _get(fbSurvey, 'Plastic_free_delivery'),
    ) !== -1
  ) {
    result.push(badges.plasticFreeDelivery);
  }
  if (_get(fbSurvey, 'BYO_container_discount')) {
    result.push(badges.BYOC);
  }
  if (_get(fbSurvey, 'Refill_my_bottle')) {
    result.push(badges.refill);
  }
  if (_get(fbSurvey, 'Food_waste_programs', []).length > 0) {
    result.push(badges.foodWaste);
  }
  if (_get(fbSurvey, 'Kitchen_points', 0) > 3) {
    result.push(badges.kitchen);
  }
  return result;
};
