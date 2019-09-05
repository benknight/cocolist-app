import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, TextButton } from '@cocolist/thumbprint-react';
import {
  ContentActionsEditSmall,
  NotificationAlertsWarningMedium,
} from '@thumbtack/thumbprint-icons';
import styles from './SurveyView.module.scss';

function getSurveyItems(survey) {
  const items = [
    [
      'plastic_free_delivery_label',
      survey.Plastic_free_delivery && [survey.Plastic_free_delivery],
    ],
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
    ['dine_in_water_label', survey.Dine_in_drinks],
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
    ['food_waste_program_label', survey.Food_waste_programs],
    [
      'menu_local_ingredients_label',
      survey.Menu.indexOf('Local ingredients') !== -1 ? ['Yes'] : null,
    ],
    [
      'menu_plant_based_label',
      survey.Menu.indexOf('Plant-based menu') !== -1 ? ['Yes'] : null,
    ],
    [
      'menu_vegetarian_label',
      survey.Menu.indexOf('Vegetarian menu') !== -1 ? ['Yes'] : null,
    ],
    ['menu_seasonal_label', survey.Menu.indexOf('Seasonal menu') !== -1 ? ['Yes'] : null],
    [
      'menu_farm_to_table_label',
      survey.Menu.indexOf('Farm-to-table') !== -1 ? ['Yes'] : null,
    ],
    [
      'menu_kitchen_garden_label',
      survey.Menu.indexOf('Kitchen garden') !== -1 ? ['Yes'] : null,
    ],
    [
      'menu_sustainable_seafood_label',
      survey.Menu.indexOf('Sustainable seafood') !== -1 ? ['Yes'] : null,
    ],
  ];
  return items;
}

const SurveyView = ({ onClickEdit, biz }) => {
  const items =
    biz.survey &&
    getSurveyItems(biz.survey).filter(item => item[1] && item[1].length > 0);
  if (!biz.survey || items.length === 0) {
    return (
      <div className="lh-copy bt b-gray-300 pa4 tc mt4 ph3 s_ph5 flex flex-column items-center">
        <NotificationAlertsWarningMedium />
        <h3 className="tp-title-4 mt3 mb2">
          <FormattedMessage id="business_no_data_title" />
        </h3>
        <p className="tp-body-2 mb3 mw7">
          <FormattedMessage
            id="business_no_data_description"
            values={{ business: biz.name }}
          />
        </p>
        <Button
          icon={<ContentActionsEditSmall />}
          onClick={onClickEdit}
          size="small"
          theme="primary">
          <FormattedMessage id="edit_business_action_label" />
        </Button>
      </div>
    );
  }
  return (
    <div className={cx(styles.container)}>
      <div className="mt0 mb4 flex items-baseline justify-between">
        <h3 className="tp-title-4">
          <FormattedMessage id="business_survey_heading" />
        </h3>
        <div className="ml2 tp-body-2">
          <TextButton
            onClick={onClickEdit}
            iconLeft={<ContentActionsEditSmall className="w1" />}
            theme="inherit">
            <FormattedMessage id="edit_action_label" />
          </TextButton>
        </div>
      </div>
      <ul className="tp-body-3 ph0">
        {items.map(([key, values]) => (
          <li key={key} className="bb b-gray-300 mb2">
            <div className="flex justify-between items-end">
              <div className="b mr4">
                <FormattedMessage id={key} />
              </div>
              <div className="tr flex items-center">
                <div className="mr1 mw6">
                  {values &&
                    values.map((value, index) => (
                      <React.Fragment key={`${key}-${index}`}>
                        <div className={styles.itemValue}>
                          <FormattedMessage id={value} />
                        </div>
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

SurveyView.propTypes = {
  onClickEdit: PropTypes.func.isRequired,
  biz: PropTypes.object.isRequired,
};

SurveyView.defaultProps = {
  columns: 1,
};

export default SurveyView;
