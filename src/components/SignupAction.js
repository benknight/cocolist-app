import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalContent,
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
      <Modal isOpen={isOpen} onCloseClick={() => setIsOpen(false)}>
        <ModalHeader>
          <ModalTitle>{formatMessage({ id: 'signup_heading' })}</ModalTitle>
        </ModalHeader>
        <ModalContent>
          <SignupForm />
        </ModalContent>
      </Modal>
    </>
  );
};

export default injectIntl(SignupAction);
