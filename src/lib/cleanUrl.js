export default function cleanUrl(url) {
  return url
    .replace(/https?:\/\//, '') // remove protocol
    .replace(/www\./, '') // remove www
    .replace(/\?.+/, '') // remove query string
    .replace(/\/$/, ''); // remove trailing slash
}
