const langs = ['en', 'vi'];
const defaultLang = 'en';

// TODO: Write tests

function isValidLang(string) {
  return langs.indexOf(string) !== -1;
}

function parseLangFromURL(url) {
  if (!url.startsWith('/')) {
    throw new Error('Invalid URL.');
  }
  const firstToken = url.split('/')[1];
  return isValidLang(firstToken) ? firstToken : defaultLang;
}

function getLocalizedURL(url, lang) {
  if (!url.startsWith('/')) {
    throw new Error('Invalid URL.');
  }
  const tokens = url.split('/');
  if (isValidLang(tokens[1])) {
    url = url.replace(`/${tokens[1]}`, '');
  }
  if (lang === defaultLang) {
    return url;
  }
  return `/${lang}${url}`;
}

module.exports = {
  langs,
  defaultLang,
  isValidLang,
  parseLangFromURL,
  getLocalizedURL,
};
