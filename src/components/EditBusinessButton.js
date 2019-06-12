import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, TextButton } from '@cocolist/thumbprint-react';
import { ContentActionsEditSmall } from '@thumbtack/thumbprint-icons';

const onEditBusiness = survey => {
  window.open(
    `https://airtable.com/shrw4zfDcry512acj?${_get(
      survey,
      'Survey_Prefill_Query_String',
      '',
    )}`,
  );
};

const labelId = 'edit_business_action_label';

const EditBusinessButton = ({ intl: { formatMessage }, iconOnly, survey, theme }) =>
  theme === 'text' ? (
    <TextButton
      accessibilityLabel={formatMessage({ id: labelId })}
      onClick={() => onEditBusiness(survey)}
      iconLeft={<ContentActionsEditSmall className="w1" />}
      theme="inherit">
      {!iconOnly && <FormattedMessage id={labelId} />}
    </TextButton>
  ) : (
    <Button
      icon={<ContentActionsEditSmall />}
      onClick={() => onEditBusiness(survey)}
      size="small"
      theme="tertiary">
      {!iconOnly && <FormattedMessage id="edit_business_action_label" />}
    </Button>
  );

EditBusinessButton.propTypes = {
  iconOnly: PropTypes.bool,
  survey: PropTypes.object.isRequired,
  theme: PropTypes.oneOf(['text', 'button']),
};

EditBusinessButton.defaultProps = {
  theme: 'text',
};

export default injectIntl(EditBusinessButton);
