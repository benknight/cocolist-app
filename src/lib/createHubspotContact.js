import axios from 'axios';
import { parseLangFromURL } from './common/i18n';
import getCookieValue from './getCookieValue';

export default function createHubspotContact(formData) {
  const formId = process.env.GATSBY_HUBSPOT_BETA_FORM_GUID;
  const portalId = process.env.GATSBY_HUBSPOT_PORTAL_ID;
  const target = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
  return axios.post(target, {
    context: {
      hutk: getCookieValue('hubspotutk'),
      pageName: 'Sign up',
      pageUri: 'https://cocolist.app',
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
