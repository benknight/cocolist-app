import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { TextButton } from '@thumbtack/thumbprint-react';
import Button from './Button';

const AddBusinessAction = ({ intl: { formatMessage }, variant, size }) => {
  const onClick = () => window.open('https://airtable.com/shrw4zfDcry512acj');
  return (
    <>
      {variant === 'button' && (
        <Button onClick={onClick} size={size}>
          <FormattedMessage id="add_business_button_label" />
        </Button>
      )}
      {variant === 'text' && (
        <TextButton onClick={onClick}>
          <FormattedMessage id="add_business_button_label" />
        </TextButton>
      )}
    </>
  );
};

AddBusinessAction.propTypes = {
  variant: PropTypes.oneOf(['button', 'text']).isRequired,
  size: PropTypes.oneOf(['small']),
};

export default injectIntl(AddBusinessAction);
