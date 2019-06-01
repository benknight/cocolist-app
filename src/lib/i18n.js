export const locales = ['en', 'vi'];
export const defaultLocale = 'en';

export function isValidLocale(string) {
  return locales.indexOf(string) !== -1;
}

export function parseLocaleFromURL(url) {
  if (!url.startsWith('/')) {
    throw new Error('Invalid URL.');
  }
  const firstToken = url.split('/')[1];
  return isValidLocale(firstToken) ? firstToken : defaultLocale;
}

export function getLocalizedURL(url, locale) {
  if (!url.startsWith('/')) {
    throw new Error('Invalid URL.');
  }
  const tokens = url.split('/');
  if (isValidLocale(tokens[1])) {
    url = url.replace(`/${tokens[1]}`, '');
  }
  if (locale === defaultLocale) {
    return url;
  }
  return `/${locale}${url}`;
}
