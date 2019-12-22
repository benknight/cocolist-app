// https://firebase.google.com/docs/functions/write-firebase-functions
const axios = require('axios');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.pendingReviewNotification = functions.firestore
  .document('reviewsPending/{reviewId}')
  .onWrite(async (change, context) => {
    const data = change.after.data();
    const base = 'http://us-central1-cocolist-app.cloudfunctions.net';
    const approveUrl = `${base}/approveReview?id=${context.params.reviewId}`;
    const rejectUrl = `${base}/rejectReview?id=${context.params.reviewId}`;
    try {
      await mailTransport.sendMail({
        from: 'Cocolist <noreply@cocolist.vn>',
        to: 'makesaigongreenagain@gmail.com',
        subject: `New review submitted for ${data.business.name}`,
        text: `${JSON.stringify(
          data,
          null,
          4,
        )}\n\nApprove: ${approveUrl}\n\nReject: ${rejectUrl}`,
      });
    } catch (error) {
      if (error) {
        console.error(error);
      }
    }
  });

exports.approveReview = functions.https.onRequest(async (req, res) => {
  try {
    const docRef = db.collection('reviewsPending').doc(req.query.id);
    const doc = await docRef.get();
    const data = doc.data();
    await db
      .collection('reviews')
      .doc(req.query.id)
      .set({ ...data });
    await docRef.delete();
    const user = await admin.auth().getUser(data.user.id);
    await mailTransport.sendMail({
      from: 'Cocolist <noreply@cocolist.vn>',
      to: user.email,
      subject:
        data.user.lang === 'vi'
          ? `Đánh giá của bạn cho ${data.business.name} đã được phê duyệt`
          : `Your review for ${data.business.name} has been approved`,
      text:
        data.user.lang === 'vi'
          ? `Cảm ơn bạn đã đánh giá về ${data.business.name}. Bạn có thể xem nó tại https://cocolist.vn${data.business.url}`
          : `Thank for your your review of ${data.business.name}. You can see it at https://cocolist.vn${data.business.url}`,
    });
    res.status(200).send('Success');
  } catch (error) {
    if (error) {
      console.error(error);
    }
    res.status(500).send('Error');
  }
});

exports.rejectReview = functions.https.onRequest(async (req, res) => {
  try {
    const doc = db.collection('reviewsPending').doc(req.query.id);
    await doc.delete();
    res.status(200).send('Success');
  } catch (error) {
    if (error) {
      console.error(error);
    }
    res.status(500).send('Error');
  }
});

const githubToken = functions.config().github.token;
const deploySecret = functions.config().deploy.secret;

exports.deploy = functions.https.onRequest(async (req, res) => {
  if (req.query.secret !== deploySecret) {
    res.status(403).send('Unauthorized');
    return;
  }
  try {
    await axios.post(
      'https://api.github.com/repos/benknight/cocolist/dispatches',
      {
        event_type: 'deploy',
      },
      {
        auth: {
          username: 'benknight',
          password: githubToken,
        },
        headers: { Accept: 'application/vnd.github.everest-preview+json' },
      },
    );
    res.status(200).send('Success');
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
    return;
  }
});
