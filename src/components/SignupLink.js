import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  ModalDefault,
  ModalDefaultHeader,
  ModalDefaultTitle,
  ModalDefaultContent,
  TextButton,
} from '@cocolist/thumbprint-react';
import Signup from './Signup';

const SignupButton = ({ intl: { formatMessage } }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <TextButton onClick={() => setIsOpen(!isOpen)}>
        <FormattedMessage id="header_link_signup" />
      </TextButton>
      <ModalDefault isOpen={isOpen} onCloseClick={() => setIsOpen(false)}>
        <ModalDefaultHeader>
          <ModalDefaultTitle>{formatMessage({ id: 'signup_heading' })}</ModalDefaultTitle>
        </ModalDefaultHeader>
        <ModalDefaultContent>
          <Signup isPopup />
        </ModalDefaultContent>
      </ModalDefault>
    </>
  );
};

export default injectIntl(SignupButton);
