import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { InputsStarMedium } from '@thumbtack/thumbprint-icons';
import {
  ButtonRow,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalContent,
  ModalFooter,
  TextArea,
  TextButton,
  ModalDescription,
} from '@thumbtack/thumbprint-react';
import useAuth from '../lib/useAuth';
import useFirebase from '../lib/useFirebase';
import { parseLangFromURL, getLocalizedURL } from '../lib/common/i18n';
import Button from './Button';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import StarRating from './StarRating';

const ReviewForm = ({ biz, location }) => {
  const auth = useAuth();
  const { formatMessage } = useIntl();
  const firebase = useFirebase();
  const [isModalOpen, openModal] = useState(location.hash === '#add-review');
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [isSaving, setSaving] = useState(false);
  const langKey = parseLangFromURL(location.pathname);

  const onStarClick = value => {
    setRating(value);
    openModal(true);
  };
  const onCloseModal = () => {
    openModal(false);
  };
  const onSubmit = async () => {
    if (!rating || !description) {
      return false;
    }
    setSaving(true);
    try {
      await firebase
        .firestore()
        .collection('reviewsPending')
        .doc(`user-${auth.user.uid}-biz-${biz.urlKey}`)
        .set({
          business: {
            id: biz.urlKey,
            name: biz.name,
            url: biz.url,
          },
          comment: description,
          created: new Date(),
          rating,
          user: {
            id: auth.user.uid,
            name: auth.user.displayName,
            lang: langKey,
          },
        });
      window.alert(formatMessage({ id: 'review_thanks' }, { businessName: biz.name }));
      onCloseModal();
    } catch (error) {
      window.alert(formatMessage({ id: 'generic_error_message' }));
      console.log(error);
    }
    setSaving(false);
  };
  return (
    <>
      <Modal isOpen={isModalOpen} onCloseClick={() => onCloseModal()} width="narrow">
        {auth.user ? (
          auth.user.displayName ? (
            <>
              <ModalHeader>
                <ModalTitle>
                  {formatMessage(
                    { id: 'write_review_heading_long' },
                    { businessName: biz.name },
                  )}
                </ModalTitle>
              </ModalHeader>
              <ModalContent>
                <StarRating
                  onStarClick={value => setRating(value)}
                  rating={rating}
                  size="large"
                />
                <div className="mt4">
                  <TextArea
                    isRequired
                    maxLength={140}
                    onChange={value => setDescription(value)}
                    value={description}
                  />
                </div>
              </ModalContent>
              <ModalFooter>
                <ButtonRow justify="right" isStackedBelowSmall>
                  <Button
                    isDisabled={!rating || !description}
                    isLoading={isSaving}
                    onClick={() => onSubmit()}
                    width="full-below-small">
                    <FormattedMessage id="submit_button_label" />
                  </Button>
                </ButtonRow>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader>
                <ModalTitle>
                  {formatMessage({ id: 'write_review_profile_heading' })}
                </ModalTitle>
                <ModalDescription>
                  <FormattedMessage
                    id="write_review_profile_description"
                    values={{ businessName: biz.name }}
                  />
                </ModalDescription>
              </ModalHeader>
              <ModalContent>
                <SignupForm />
              </ModalContent>
            </>
          )
        ) : (
          <LoginForm
            returnTo={`${location.origin}${getLocalizedURL(
              location.pathname,
              langKey,
            )}#add-review`}
          />
        )}
      </Modal>
      <div className="tc">
        <div className="tp-title-6">
          <FormattedMessage id="write_review_heading" />
        </div>
        {[1, 2, 3, 4, 5].map(index => (
          <TextButton
            accessibilityLabel={`${index}-star rating`}
            key={index}
            onClick={() => onStarClick(index)}
            iconLeft={<InputsStarMedium />}
            theme="inherit"
          />
        ))}
      </div>
    </>
  );
};

ReviewForm.propTypes = {
  biz: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default ReviewForm;
