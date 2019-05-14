import React from 'react';
import { FormattedMessage } from 'react-intl';

function parseSections(data) {
  return [
    {
      title: 'Dine-in',
      items: {
        Straws: data.Dine_in_straws,
        Utensils: data.Dine_in_utensils,
        Napkins: data.Dine_in_napkins,
        Water: data.Dine_in_water,
        Cups: data.Dine_in_cups,
        'Drink stirrers': data.Dine_in_drink_stirrers,
        Linens: data.Dine_in_linens__table_or_placemats_,
        Dishes: data.Dine_in_dishes,
      },
    },
    {
      title: 'Take-out',
      items: {
        Containers: data.Take_out_containers,
        'Container lids': data.Take_out_container_lids,
        'Cold cups': data.Take_out_cold_cups,
        'Hot cups': data.Take_out_hot_cups,
        'Cup lids': data.Take_out_cup_lids,
        Straws: data.Take_out_straws,
        'Cup carriers': data.Take_out_cup_carriers,
        'Cup sleeves': data.Take_out_cup_sleeves,
        'Food wrapping': data.Take_out_food_wrapping,
      },
    },
    {
      title: 'Kitchen',
      items: {
        'Piping bags': data.Kitchen_piping_bags,
        'Pan liners': data.Kitchen_pan_liners,
        'Food wrapping': data.Kitchen_food_wrapping,
        Gloves: data.Kitchen_gloves,
        'Food freeze packaging': data.Kitchen_food_freeze_packaging,
        'Waste management': data.Kitchen_waste_management,
      },
    },
  ];
}

const FBSurveyView = ({ data }) => {
  const sections = parseSections(data);
  return sections.map(section => (
    <>
      <h3>
        <FormattedMessage id={section.title} />
      </h3>
      <ul className="list mh0 f6">
        {Object.keys(section.items).map(
          label =>
            section.items[label] && (
              <li className="bb b--light-gray pb2 ph1 mb2 nl1 nr1">
                <div className="flex justify-between">
                  <div className="fw5">
                    <FormattedMessage id={label} />
                  </div>
                  <div className="tr">
                    <FormattedMessage id={section.items[label]} />
                  </div>
                </div>
              </li>
            ),
        )}
      </ul>
    </>
  ));
};

export default FBSurveyView;
