import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';
import {
  ButtonRow,
  InPageAlert,
  Label,
  TextButton,
  TextInput,
} from '@thumbtack/thumbprint-react';
import useAuth from '../lib/useAuth';
import Button from './Button';
import Loader from './Loader';

export const loginMachine = Machine({
  id: 'login',
  initial: 'form',
  states: {
    form: {
      initial: 'idle',
      on: {
        AFTER_SUBMIT: 'pending',
        ERROR: 'error',
      },
      states: {
        idle: {
          on: {
            SUBMIT: 'loading',
          },
        },
        loading: {},
      },
    },
    pending: {
      on: {
        TROUBLE: 'trouble',
      },
    },
    trouble: {
      on: {
        BACK: 'pending',
        RESEND: 'pending',
      },
    },
    error: {
      on: {
        TRY_AGAIN: 'form',
      },
    },
  },
});

const LoginForm = ({ returnTo }) => {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [loginState, send] = useMachine(loginMachine, { devTools: true });

  const onSubmit = async email => {
    send('SUBMIT');
    try {
      await auth.signIn(email, returnTo);
      send('AFTER_SUBMIT');
    } catch (error) {
      send('ERROR');
    }
  };

  if (auth.isBusy) {
    return (
      <div className="mv4">
        <Loader />
      </div>
    );
  }

  let content = null;

  if (loginState.matches('form')) {
    content = (
      <>
        <form
          onSubmit={event => {
            event.preventDefault();
            onSubmit(email);
          }}>
          {auth.invalidLink && (
            <div className="mb4">
              <InPageAlert theme="bad">
                <FormattedMessage id="signin_invalid_link" />
              </InPageAlert>
            </div>
          )}
          <div className="tp-title-3">
            <FormattedMessage id="signin_with_email_heading" />
          </div>
          <div className="mv4">
            <Label for="loginEmail">
              <FormattedMessage id="signin_email_label" />
            </Label>
            <TextInput
              id="loginEmail"
              onChange={email => setEmail(email)}
              type="email"
              value={email}
            />
          </div>
          <ButtonRow justify="right">
            <Button isLoading={loginState.matches('form.loading')} type="submit">
              <FormattedMessage id="signin_button_next" />
            </Button>
          </ButtonRow>
        </form>
      </>
    );
  } else if (loginState.matches('pending')) {
    content = (
      <>
        <div className="tp-title-3 mb2">
          <FormattedMessage id="signin_with_email_sent_heading" />
        </div>
        <div className="mb2">
          <FormattedMessage id="signin_with_email_sent_description" values={{ email }} />
        </div>
        <TextButton onClick={() => send('TROUBLE')}>
          <FormattedMessage id="signin_trouble_heading" />
        </TextButton>
      </>
    );
  } else if (loginState.matches('trouble')) {
    content = (
      <>
        <div className="tp-title-3">
          <FormattedMessage id="signin_trouble_heading" />
        </div>
        <div className="mv2">
          <FormattedMessage id="signin_trouble_description" />
        </div>
        <div className="flex items-center justify-between">
          <TextButton
            onClick={() => {
              onSubmit(email);
              send('RESEND');
            }}>
            <FormattedMessage id="signin_button_resend" />
          </TextButton>
          <Button onClick={() => send('BACK')} theme="secondary">
            <FormattedMessage id="signin_button_back" />
          </Button>
        </div>
      </>
    );
  } else if (loginState.matches('error')) {
    content = (
      <>
        <div className="mb4">
          <FormattedMessage id="signin_form_error" />
        </div>
        <Button onClick={() => send('TRY_AGAIN')} size="small" theme="tertiary">
          <FormattedMessage id="signin_form_retry_button_label" />
        </Button>
      </>
    );
  }

  return <div className="tp-body-1">{content}</div>;
};

LoginForm.propTypes = {
  returnTo: PropTypes.string,
};

export default LoginForm;
