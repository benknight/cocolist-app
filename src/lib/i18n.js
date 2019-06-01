export const langs = ['en', 'vi'];
export const defaultLang = 'en';

// TODO: Write tests

export function isValidLang(string) {
  return langs.indexOf(string) !== -1;
}

export function parseLangFromURL(url) {
  if (!url.startsWith('/')) {
    throw new Error('Invalid URL.');
  }
  const firstToken = url.split('/')[1];
  return isValidLang(firstToken) ? firstToken : defaultLang;
}

export function getLocalizedURL(url, lang) {
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
