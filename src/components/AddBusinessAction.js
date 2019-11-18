import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, TextButton } from '@cocolist/thumbprint-react';
import AirtableFormModal from './AirtableFormModal';

const AddBusinessAction = ({ intl: { formatMessage }, variant, size }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {variant === 'button' && (
        <Button onClick={() => setIsOpen(!isOpen)} size={size}>
          <FormattedMessage id="add_business_button_label" />
        </Button>
      )}
      {variant === 'text' && (
        <TextButton onClick={() => setIsOpen(!isOpen)}>
          <FormattedMessage id="add_business_button_label" />
        </TextButton>
      )}
      <AirtableFormModal
        formId="shrw4zfDcry512acj"
        isOpen={isOpen}
        onCloseClick={() => setIsOpen(false)}
      />
    </>
  );
};

AddBusinessAction.propTypes = {
  variant: PropTypes.oneOf(['button', 'text']).isRequired,
  size: PropTypes.oneOf(['small']),
};

export default injectIntl(AddBusinessAction);
