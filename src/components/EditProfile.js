import axios from 'axios';
import { StaticQuery, graphql } from 'gatsby';
import React, { useContext, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, ButtonRow, Input, Label, Select } from '@cocolist/thumbprint-react';
import auth from '../lib/auth';
import getCookieValue from '../lib/getCookieValue';
import { parseLangFromURL } from '../lib/i18n';
import { AuthContext } from './AuthProvider';

function createHubspotContact(email, formData) {
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
        value: email,
      },
      {
        name: 'hs_language',
        value: parseLangFromURL(window.location.pathname),
      },
    ],
  });
}

function EditProfile({ intl: { formatMessage } }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    district: '',
  });
  const { user } = useContext(AuthContext);
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
            await Promise.all([
              auth.updateUser({
                displayName: `${formData.firstName} ${formData.lastName}`.trim(),
              }),
              createHubspotContact(user.email, formData),
            ]);
            setIsLoading(false);
          }}>
          <div className="tp-title-3">
            <FormattedMessage id="profile_heading" />
          </div>
          <div className="mv4">
            <Label for="firstName">
              <FormattedMessage id="profile_first_name_label" />
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
              <FormattedMessage id="profile_last_name_label" />
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
              <FormattedMessage id="profile_district_label" />
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
          <ButtonRow justify="right">
            <Button isLoading={isLoading} type="submit">
              <FormattedMessage id="profile_button_save" />
            </Button>
          </ButtonRow>
        </form>
      )}
    />
  );
}

export default injectIntl(EditProfile);
