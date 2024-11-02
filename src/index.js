import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from '../src/components/GlobalStyles';
import { GlobalcontextProvider } from "./GlobalContext"

import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<GlobalcontextProvider>
  <React.StrictMode>
      <GlobalStyles>
        <GoogleOAuthProvider clientId='821511653841-8pl4t0g613qms41ghjpblgkhaggfluto.apps.googleusercontent.com'>
                <App />
        </GoogleOAuthProvider>
      </GlobalStyles>
  </React.StrictMode>,
</GlobalcontextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
