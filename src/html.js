import React from 'react';
import PropTypes from 'prop-types';

function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <script src="https://cdn.firebase.com/libs/firebaseui/3.6.0/firebaseui.js" />
        <link
          href="https://cdn.firebase.com/libs/firebaseui/3.6.0/firebaseui.css"
          rel="stylesheet"
        />
        <link
          href="//fonts.googleapis.com/css?family=Montserrat:400,500,700"
          rel="stylesheet"
        />
        <title>Cocolist</title>
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <noscript key="noscript" id="gatsby-noscript">
          This app works best with JavaScript enabled.
        </noscript>
        <div key="body" id="___gatsby" dangerouslySetInnerHTML={{ __html: props.body }} />
        <div className="ma4-l" id="firebaseui-auth-container" />
        <script src="https://www.gstatic.com/firebasejs/6.0.1/firebase-app.js" />
        <script src="https://www.gstatic.com/firebasejs/6.0.1/firebase-auth.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Your web app's Firebase configuration
            var firebaseConfig = {
              apiKey: '${process.env.GATSBY_FIREBASE_API_KEY}',
              authDomain: 'cocolist-app.firebaseapp.com',
              databaseURL: 'https://cocolist-app.firebaseio.com',
              projectId: 'cocolist-app',
              storageBucket: 'cocolist-app.appspot.com',
              messagingSenderId: '665301945275',
              appId: '1:665301945275:web:15bc0317862ae1da',
            };

            // Initialize Firebase
            window.firebase.initializeApp(firebaseConfig);
            window.firebaseauthui = new window.firebaseui.auth.AuthUI(window.firebase.auth());
            `,
          }}
        />
        {props.postBodyComponents}
      </body>
    </html>
  );
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
};

export default HTML;
