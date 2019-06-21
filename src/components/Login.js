import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Machine, interpret } from 'xstate';
import { Button, ButtonRow, Input, Label, TextButton } from '@cocolist/thumbprint-react';

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

class Login extends React.PureComponent {
  state = {
    email: '',
    loginState: loginMachine.initialState,
  };

  loginService = interpret(loginMachine).onTransition(loginState =>
    this.setState({ loginState }),
  );

  componentDidMount() {
    this.loginService.start();
  }

  componentWillUnmount() {
    this.loginService.stop();
  }

  onSubmit(email) {
    this.loginService.send('SUBMIT');
    this.props
      .onSubmit({ email })
      .then(() => {
        this.loginService.send('AFTER_SUBMIT');
      })
      .catch(() => {
        this.loginService.send('ERROR');
      });
  }

  render() {
    const { loginState, email } = this.state;
    let content = null;

    if (loginState.matches('form')) {
      content = (
        <>
          <form
            onSubmit={event => {
              event.preventDefault();
              this.onSubmit(email);
            }}>
            {this.props.invalidLink && (
              <div className="red mb2">
                <FormattedMessage id="signin_invalid_link" />
              </div>
            )}
            <div className="tp-title-3">
              <FormattedMessage id="signin_with_email_heading" />
            </div>
            <div className="mv4">
              <Label for="loginEmail">
                <FormattedMessage id="signin_email_label" />
              </Label>
              <Input
                id="loginEmail"
                onChange={email => this.setState({ email })}
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
            <FormattedMessage
              id="signin_with_email_sent_description"
              values={{ email }}
            />
          </div>
          <TextButton onClick={() => this.loginService.send('TROUBLE')}>
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
                this.onSubmit(email);
                this.loginService.send('RESEND');
              }}>
              <FormattedMessage id="signin_button_resend" />
            </TextButton>
            <Button onClick={() => this.loginService.send('BACK')} theme="secondary">
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
          <Button
            onClick={() => this.loginService.send('TRY_AGAIN')}
            size="small"
            theme="tertiary">
            <FormattedMessage id="signin_form_retry_button_label" />
          </Button>
        </>
      );
    }

    return content;
  }
}

Login.propTypes = {
  invalidLink: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};

export default injectIntl(Login);
