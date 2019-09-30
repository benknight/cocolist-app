import 'firebase/auth';
import firebase from 'firebase/app';

export default {
  updateSubscriptions: [],

  isSignInWithEmailLink(url) {
    return firebase.auth().isSignInWithEmailLink(url);
  },

  login({ email }) {
    return firebase
      .auth()
      .sendSignInLinkToEmail(email, {
        handleCodeInApp: true,
        url: window.location.href,
      })
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);
      })
      .catch(error => {
        console.error(error.message);
        throw new Error();
      });
  },

  onAuthStateChanged(callback) {
    return firebase.auth().onAuthStateChanged(callback);
  },

  signInWithEmailLink(email, url) {
    return firebase
      .auth()
      .signInWithEmailLink(email, url)
      .then(result => {
        window.localStorage.removeItem('emailForSignIn');
      });
  },

  async updateUser(data) {
    await firebase.auth().currentUser.updateProfile(data);
    this.updateSubscriptions.forEach(sub => sub(data));
  },

  onUserUpdated(callback) {
    const index = this.updateSubscriptions.push(callback) - 1;
    return () => this.updateSubscriptions.splice(index, 1);
  },
};
