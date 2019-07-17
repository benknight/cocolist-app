import cx from 'classnames';
import _chunk from 'lodash/chunk';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { TextButton } from '@cocolist/thumbprint-react';
import {
  ContentActionsEditSmall,
  NavigationCaretDownTiny,
} from '@thumbtack/thumbprint-icons';
import styles from './SurveyView.module.scss';

function parseSections(survey) {
  const sections = [
    {
      title: 'take_out_section_title',
      items: [
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
      ],
    },
  ];
  if (!survey.Delivery_only) {
    sections.push({
      title: 'dine_in_section_title',
      items: [
        ['dine_in_straws_label', survey.Dine_in_straws],
        ['dine_in_utensils_label', survey.Dine_in_utensils],
        ['dine_in_napkins_label', survey.Dine_in_napkins],
        ['dine_in_water_label', survey.Dine_in_drinks],
        ['dine_in_cups_label', survey.Dine_in_cups],
        ['dine_in_drink_stirrers_label', survey.Dine_in_drink_stirrers],
        ['dine_in_linens_label', survey.Dine_in_linens__table_or_placemats_],
        ['dine_in_dishes_label', survey.Dine_in_dishes],
      ],
    });
  }
  sections.push(
    {
      title: 'menu_section_title',
      items: [
        [
          'menu_local_ingredients_label',
          survey.Menu.indexOf('Local ingredients') !== -1 ? ['Yes'] : ['No'],
        ],
        [
          'menu_plant_based_label',
          survey.Menu.indexOf('Plant-based menu') !== -1 ? ['Yes'] : ['No'],
        ],
        [
          'menu_vegetarian_label',
          survey.Menu.indexOf('Vegetarian menu') !== -1 ? ['Yes'] : ['No'],
        ],
        [
          'menu_seasonal_label',
          survey.Menu.indexOf('Seasonal menu') !== -1 ? ['Yes'] : ['No'],
        ],
        [
          'menu_farm_to_table_label',
          survey.Menu.indexOf('Farm-to-table') !== -1 ? ['Yes'] : ['No'],
        ],
        [
          'menu_kitchen_garden_label',
          survey.Menu.indexOf('Kitchen garden') !== -1 ? ['Yes'] : ['No'],
        ],
        [
          'menu_sustainable_seafood_label',
          survey.Menu.indexOf('Sustainable seafood') !== -1 ? ['Yes'] : ['No'],
        ],
      ],
    },
    {
      title: 'kitchen_section_title',
      items: [
        ['kitchen_piping_bags_label', survey.Kitchen_piping_bags],
        ['kitchen_pan_liners_label', survey.Kitchen_pan_liners],
        ['kitchen_food_wrapping_label', survey.Kitchen_food_wrapping],
        ['kitchen_gloves_label', survey.Kitchen_gloves],
        ['kitchen_food_freeze_packaging_label', survey.Kitchen_food_freeze_packaging],
        [
          'waste_separation',
          survey.Kitchen_waste_management.indexOf('Waste separation') !== -1
            ? ['Yes']
            : null,
        ],
        [
          'sink_grease_traps',
          survey.Kitchen_waste_management.indexOf('Grease traps on sinks') !== -1
            ? ['Yes']
            : null,
        ],
        ['food_waste_program_label', survey.Food_waste_programs],
      ],
    },
  );
  // sections.forEach(section => {
  //   section.items = section.items.sort((a, b) => {
  //     if (!b[1] || b[1].indexOf('Not used') !== -1) {
  //       return -1;
  //     }
  //     return 0;
  //   });
  // });
  return sections;
}

const Section = injectIntl(
  ({ intl: { formatMessage }, onClickEdit, section, survey }) => {
    const [isExpanded, setExpanded] = useState(true);
    const hasEmptyItems = section.items.find(
      ([key, values]) => _get(values, 'length', 0) === 0,
    );
    return (
      <section className="mb4 m_mb5" key={section.title}>
        <div className="tp-title-4 mt0 mb4 flex items-baseline">
          <FormattedMessage id={section.title} />
          <div className="ml2">
            <TextButton
              accessibilityLabel={formatMessage({ id: 'edit_business_action_label' })}
              onClick={onClickEdit}
              iconLeft={<ContentActionsEditSmall className="w1" />}
              theme="inherit"
            />
          </div>
        </div>
        <ul className="tp-body-3 ph0">
          {section.items.map(([key, values]) => (
            <li
              key={key}
              className={cx(
                { dn: _get(values, 'length', 0) === 0 && !isExpanded },
                'bb b-gray-300 mb2',
              )}>
              <div className="flex justify-between items-end">
                <div className="b mr4">
                  <FormattedMessage id={key} />
                </div>
                <div className="tr flex items-center">
                  <div className="mr1">
                    {values &&
                      values.map((value, index) => (
                        <React.Fragment key={`${key}-${index}`}>
                          <div className={styles.itemValue}>
                            <FormattedMessage id={value} />
                          </div>
                        </React.Fragment>
                      ))}
                  </div>
                  <div className="dn">
                    <TextButton
                      accessibilityLabel="Edit this"
                      iconLeft={<ContentActionsEditSmall className="h1 o-70" />}
                      onClick={onClickEdit}
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="tp-body-3">
          {hasEmptyItems && !isExpanded && (
            <TextButton
              iconLeft={<NavigationCaretDownTiny />}
              onClick={() => setExpanded(true)}>
              Show all
            </TextButton>
          )}
        </div>
      </section>
    );
  },
);

const SurveyView = ({ columns, onClickEdit, survey }) => {
  const sections = parseSections(survey).filter(section => !_isEmpty(section.items));
  return (
    <div className={cx(styles.container, 'm_flex flex-wrap')}>
      {_chunk(sections, columns).map((sections, index) => (
        <div key={`column-${index}`} className={cx(styles.column, 'flex-auto')}>
          {sections.map(section => (
            <Section {...{ key: section.title, onClickEdit, section, survey }} />
          ))}
        </div>
      ))}
    </div>
  );
};

SurveyView.propTypes = {
  columns: PropTypes.number,
  onClickEdit: PropTypes.func.isRequired,
  survey: PropTypes.object.isRequired,
};

SurveyView.defaultProps = {
  columns: 1,
};

export default SurveyView;
