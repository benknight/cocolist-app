const parse = require('url-parse');
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

function getLocalizedVNMMURL(url, lang) {
  const parsedUrl = parse(url);
  if (parsedUrl.hostname.indexOf('vietnammm.com') === -1) {
    throw new Error(`The url provided is not a valid VietnamMM url: ${url}`);
  }
  if (lang === 'en') {
    if (parsedUrl.pathname.startsWith('/en/')) {
      return url;
    }
    parsedUrl.set('pathname', `/en${parsedUrl.pathname}`);
    return parsedUrl.toString();
  }
  if (lang === 'vi') {
    if (!parsedUrl.pathname.startsWith('/en/')) {
      return url;
    }
    parsedUrl.set('pathname', parsedUrl.pathname.replace('/en/', '/'));
    return parsedUrl.toString();
  }
  return url.replace('/en/', '/');
}

module.exports = {
  langs,
  defaultLang,
  isValidLang,
  parseLangFromURL,
  getLocalizedURL,
  getLocalizedVNMMURL,
};
