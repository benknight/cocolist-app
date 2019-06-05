import cx from 'classnames';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { TextButton } from '@cocolist/thumbprint-react';
import { ContentActionsEditSmall } from '@thumbtack/thumbprint-icons';
import styles from './FNBSurveyView.module.scss';

function parseSections(data) {
  const sections = [
    {
      title: 'take_out_section_title',
      items: [
        [
          'plastic_free_delivery_label',
          data.Plastic_free_delivery && [data.Plastic_free_delivery],
        ],
        ['take_out_bags_label', data.Take_out_bags],
        ['take_out_containers_label', data.Take_out_containers],
        ['take_out_container_lids_label', data.Take_out_container_lids],
        ['take_out_cold_cups_label', data.Take_out_cold_cups],
        ['take_out_hot_cups_label', data.Take_out_hot_cups],
        ['take_out_cup_lids_label', data.Take_out_cup_lids],
        ['take_out_straws_label', data.Take_out_straws],
        ['take_out_cup_carriers_label', data.Take_out_cup_carriers],
        ['take_out_cup_sleeves_label', data.Take_out_cup_sleeves],
        ['take_out_food_wrapping_label', data.Take_out_food_wrapping],
      ],
    },
    {
      title: 'dine_in_section_title',
      items: [
        ['dine_in_straws_label', data.Dine_in_straws],
        ['dine_in_utensils_label', data.Dine_in_utensils],
        ['dine_in_napkins_label', data.Dine_in_napkins],
        ['dine_in_water_label', data.Dine_in_water],
        ['dine_in_cups_label', data.Dine_in_cups],
        ['dine_in_drink_stirrers_label', data.Dine_in_drink_stirrers],
        ['dine_in_linens_label', data.Dine_in_linens__table_or_placemats_],
        ['dine_in_dishes_label', data.Dine_in_dishes],
      ],
    },
    {
      title: 'kitchen_section_title',
      items: [
        ['kitchen_piping_bags_label', data.Kitchen_piping_bags],
        ['kitchen_pan_liners_label', data.Kitchen_pan_liners],
        ['kitchen_food_wrapping_label', data.Kitchen_food_wrapping],
        ['kitchen_gloves_label', data.Kitchen_gloves],
        ['kitchen_food_freeze_packaging_label', data.Kitchen_food_freeze_packaging],
        ['kitchen_waste_mgmt_label', data.Kitchen_waste_management],
        ['food_waste_program_label', data.Food_waste_programs],
      ],
    },
    {
      title: 'menu_section_title',
      items: [
        [
          'menu_local_ingredients_label',
          data.Menu.indexOf('Local ingredients') !== -1 ? ['Yes'] : ['No'],
        ],
        [
          'menu_plant_based_label',
          data.Menu.indexOf('Plant-based menu') !== -1 ? ['Yes'] : ['No'],
        ],
        [
          'menu_vegetarian_label',
          data.Menu.indexOf('Vegetarian menu') !== -1 ? ['Yes'] : ['No'],
        ],
        [
          'menu_seasonal_label',
          data.Menu.indexOf('Seasonal menu') !== -1 ? ['Yes'] : ['No'],
        ],
        [
          'menu_farm_to_table_label',
          data.Menu.indexOf('Farm-to-table') !== -1 ? ['Yes'] : ['No'],
        ],
        [
          'menu_kitchen_garden_label',
          data.Menu.indexOf('Kitchen garden') !== -1 ? ['Yes'] : ['No'],
        ],
        [
          'menu_sustainable_seafood_label',
          data.Menu.indexOf('Sustainable seafood') !== -1 ? ['Yes'] : ['No'],
        ],
      ],
    },
  ];
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

function getBusinessEditLink(businessName, sectionName, key, values) {
  const prefill = {
    prefill_Business: businessName,
    prefill_Field: `${key} (${sectionName})`,
    'prefill_New Value': values,
  };
  return `https://airtable.com/shrLDJ9fpWFhReI0S?${queryString.stringify(prefill)}`;
}

const FNBSurveyView = ({ businessName, data, intl: { formatMessage } }) => {
  const sections = parseSections(data).filter(section => !_isEmpty(section.items));
  const columns = [
    sections.slice(0, Math.ceil(sections.length / 2)),
    sections.slice(Math.ceil(sections.length / 2)),
  ];
  return (
    <div className="m_flex flex-wrap justify-between">
      {columns.map((sections, index) => (
        <div key={`column-${index}`} className={styles.column}>
          {sections.map(section => (
            <section key={section.title}>
              <div className="tp-title-3 mt0 mb4">
                <FormattedMessage id={section.title} />
              </div>
              <ul className="tp-body-2 ph0 mb4 m_mb5">
                {section.items.map(([key, values]) => (
                  <li key={key} className="bb b-gray-300 mb2">
                    <div className="flex justify-between items-end">
                      <div className="b">
                        <FormattedMessage id={key} />
                      </div>
                      <div className="tr flex items-center">
                        <div
                          className={cx(
                            { 'o-50': values && values.indexOf('Not used') !== -1 },
                            'mr1',
                          )}>
                          {values &&
                            values.map((value, index) => (
                              <React.Fragment key={value}>
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
                            onClick={() => {
                              window.open(
                                getBusinessEditLink(
                                  businessName,
                                  formatMessage({ id: section.title }),
                                  formatMessage({ id: key }),
                                  values,
                                ),
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ))}
    </div>
  );
};

FNBSurveyView.propTypes = {
  businessName: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export default injectIntl(FNBSurveyView);
