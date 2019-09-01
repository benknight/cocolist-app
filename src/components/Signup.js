import axios from 'axios';
import { StaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, ButtonRow, Input, Label, Select } from '@cocolist/thumbprint-react';
import getCookieValue from '../lib/getCookieValue';
import { parseLangFromURL } from '../lib/i18n';

function createHubspotContact(formData) {
  const formId = process.env.GATSBY_HUBSPOT_BETA_FORM_GUID;
  const portalId = process.env.GATSBY_HUBSPOT_PORTAL_ID;
  const target = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
  return axios.post(target, {
    context: {
      hutk: getCookieValue('hubspotutk'),
      pageName: 'Edit profile',
      pageUri: 'https://cocolist.vn',
    },
    fields: [
      {
        name: 'firstname',
        value: formData.firstName,
      },
      {
        name: 'lastname',
        value: formData.lastName,
      },
      {
        name: 'address',
        value: formData.district,
      },
      {
        name: 'email',
        value: formData.email,
      },
      {
        name: 'hs_language',
        value: parseLangFromURL(window.location.pathname),
      },
    ],
  });
}

function Signup({ intl: { formatMessage }, isPopup }) {
  const [isExpanded, setExpanded] = useState(isPopup);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    district: '',
  });
  if (isSuccess) {
    return <FormattedMessage id="signup_thanks" />;
  }
  return (
    <StaticQuery
      query={graphql`
        {
          districts: allAirtable(
            filter: {
              table: { eq: "Neighborhoods" }
              data: { City: { elemMatch: { data: { Name: { eq: "Saigon" } } } } }
            }
            sort: { fields: data___Business_count, order: DESC }
          ) {
            edges {
              node {
                data {
                  Name
                }
              }
            }
          }
        }
      `}
      render={({ districts: { edges } }) => (
        <form
          onSubmit={async event => {
            event.preventDefault();
            setIsLoading(true);
            try {
              await Promise.all([createHubspotContact(formData)]);
              setIsSuccess(true);
            } catch (error) {
              // Gulp!
            }
            setIsLoading(false);
          }}>
          <div className="mv4">
            <Label for="email">
              <FormattedMessage id="signin_email_label" />
            </Label>
            <Input
              id="email"
              isRequired
              onChange={email => {
                setFormData({ ...formData, email });
                if (!isExpanded) setExpanded(true);
              }}
              type="email"
              value={formData.email}
            />
          </div>
          {isExpanded && (
            <>
              <div className="mv4">
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
              <div className="mv4">
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
              <div className="mv4">
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
                  {edges.map(({ node: { data: { Name } } }) => (
                    <option key={Name} value={Name}>
                      {formatMessage({ id: Name })}
                    </option>
                  ))}
                </Select>
              </div>
            </>
          )}
          <ButtonRow justify="left">
            <Button isLoading={isLoading} type="submit">
              <FormattedMessage id="signup_button_save" />
            </Button>
          </ButtonRow>
        </form>
      )}
    />
  );
}

Signup.propTypes = {
  isPopup: PropTypes.bool,
};

export default injectIntl(Signup);
