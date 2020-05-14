export default function cleanUrl(url) {
  return url
    .replace(/\/$/, '')
    .replace(/https?:\/\//, '')
    .replace(/www\./, '');
}
