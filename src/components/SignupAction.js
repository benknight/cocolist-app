import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  ModalDefault,
  ModalDefaultHeader,
  ModalDefaultTitle,
  ModalDefaultContent,
  TextButton,
} from '@thumbtack/thumbprint-react';
import SignupForm from './SignupForm';

const SignupAction = ({ intl: { formatMessage } }) => {
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
          <SignupForm />
        </ModalDefaultContent>
      </ModalDefault>
    </>
  );
};

export default injectIntl(SignupAction);
