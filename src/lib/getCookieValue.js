export default function getCookieValue(key) {
  if (document.cookie) {
    const data = document.cookie.split(';').find(c => c.indexOf(key) !== -1);
    if (data) {
      return data.split('=')[1];
    }
  }
}
