import { graphql, useStaticQuery } from 'gatsby';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ButtonRow, Input, Label, Select } from '@thumbtack/thumbprint-react';
import useAuth from '../lib/useAuth';
import Button from './Button';

const query = graphql`
  {
    districts: allAirtable(
      filter: { table: { eq: "Neighborhoods" } }
      sort: { fields: [data___City___data___Name, data___Name], order: DESC }
    ) {
      edges {
        node {
          data {
            City {
              data {
                Name
              }
            }
            Name
          }
        }
      }
    }
  }
`;

const SignupForm = props => {
  const auth = useAuth();
  const [isSaving, setSaving] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [hasError, setError] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    district: '',
  });
  const {
    districts: { edges },
  } = useStaticQuery(query);
  const { formatMessage } = useIntl();
  if (isSuccess) {
    return <FormattedMessage id="signup_thanks" />;
  }
  return (
    <form
      onSubmit={async event => {
        event.preventDefault();
        setSaving(true);
        setError(false);
        setSuccess(false);
        try {
          await auth.saveProfile(formData);
          window.alert(
            'Your Cocolist account has been created and you are now logged in. Thank you for signing up!',
          );
        } catch (error) {
          console.log(error);
          if (error.code === 'auth/email-already-in-use') {
            window.alert('You’ve already signed up!');
          } else {
            setError(true);
          }
          setSaving(false);
        }
      }}>
      {!auth.user && (
        <div className="mb4">
          <Label for="email">
            <FormattedMessage id="signin_email_label" />
          </Label>
          <Input
            id="email"
            isRequired
            onChange={email => {
              setFormData({ ...formData, email });
            }}
            type="email"
            value={formData.email}
          />
        </div>
      )}
      <div className="mb4">
        <Label for="firstName">
          <FormattedMessage id="signup_first_name_label" />
        </Label>
        <Input
          id="firstName"
          isRequired
          onChange={firstName => setFormData({ ...formData, firstName })}
          type="text"
          value={formData.firstName}
        />
      </div>
      <div className="mb4">
        <Label for="lastName">
          <FormattedMessage id="signup_last_name_label" />
        </Label>
        <Input
          id="lastName"
          onChange={lastName => setFormData({ ...formData, lastName })}
          type="text"
          value={formData.lastName}
        />
      </div>
      <div className="mb4">
        <Label for="district">
          <FormattedMessage id="signup_district_label" />
        </Label>
        <Select
          id="district"
          isFullWidth
          onChange={district => setFormData({ ...formData, district })}
          size="large"
          value={formData.district}>
          <option></option>
          {edges.map(({ node: { data: { City, Name } } }) => (
            <option key={Name} value={Name}>
              {formatMessage({ id: City[0].data.Name })} – {formatMessage({ id: Name })}
            </option>
          ))}
        </Select>
      </div>
      {hasError && (
        <div className="red mv2">
          <FormattedMessage id="signin_form_error" />
        </div>
      )}
      <ButtonRow justify="right">
        <Button isLoading={isSaving} type="submit">
          <FormattedMessage id="submit_button_label" />
        </Button>
      </ButtonRow>
    </form>
  );
};

export default SignupForm;
