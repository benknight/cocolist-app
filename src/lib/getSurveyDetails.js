export default function getSurveyItems(survey) {
  const items = [
    ['green_delivery_label', survey.Green_delivery && [survey.Green_delivery]],
    ['take_out_bags_label', survey.Take_out_bags],
    ['take_out_containers_label', survey.Take_out_containers],
    ['take_out_container_lids_label', survey.Take_out_container_lids],
    ['take_out_cups_label', survey.Take_out_cups],
    ['take_out_cup_lids_label', survey.Take_out_cup_lids],
    ['take_out_straws_label', survey.Take_out_straws],
    ['take_out_cup_carriers_label', survey.Take_out_cup_carriers],
    ['take_out_cup_sleeves_label', survey.Take_out_cup_sleeves],
    ['take_out_food_wrapping_label', survey.Take_out_food_wrapping],
    ['dine_in_straws_label', survey.Dine_in_straws],
    ['dine_in_utensils_label', survey.Dine_in_utensils],
    ['dine_in_napkins_label', survey.Dine_in_napkins],
    ['dine_in_water_label', survey.Dine_in_drink_containers],
    ['dine_in_drinks_label', survey.Dine_in_drink_containers],
    ['dine_in_cups_label', survey.Dine_in_cups],
    ['dine_in_drink_stirrers_label', survey.Dine_in_drink_stirrers],
    ['dine_in_linens_label', survey.Dine_in_linens__table_or_placemats_],
    ['dine_in_dishes_label', survey.Dine_in_dishes],
    ['kitchen_piping_bags_label', survey.Kitchen_piping_bags],
    ['kitchen_pan_liners_label', survey.Kitchen_pan_liners],
    ['kitchen_food_wrapping_label', survey.Kitchen_food_wrapping],
    ['kitchen_gloves_label', survey.Kitchen_gloves],
    ['kitchen_food_freeze_packaging_label', survey.Kitchen_food_freeze_packaging],
    [
      'waste_separation',
      survey.Kitchen_waste_management.indexOf('Waste separation') !== -1 ? ['Yes'] : null,
    ],
    [
      'sink_grease_traps',
      survey.Kitchen_waste_management.indexOf('Grease traps on sinks') !== -1
        ? ['Yes']
        : null,
    ],
    [
      'menu_plant_based_label',
      survey.Menu.indexOf('Plant-based menu') !== -1 ? ['Yes'] : null,
    ],
    [
      'menu_vegetarian_label',
      survey.Menu.indexOf('Vegetarian menu') !== -1 ? ['Yes'] : null,
    ],
    [
      'menu_plant_based_options_label',
      survey.Menu.indexOf('Plant-based options') !== -1 ? ['Yes'] : null,
    ],
    [
      'menu_vegetarian_options_label',
      survey.Menu.indexOf('Vegetarian options') !== -1 ? ['Yes'] : null,
    ],
    [
      'menu_kitchen_garden_label',
      survey.Menu.indexOf('Kitchen garden') !== -1 ? ['Yes'] : null,
    ],
  ];
  return items.filter(item => item[1] && item[1].length > 0);
}
