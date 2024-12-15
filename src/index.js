import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from '../src/components/GlobalStyles';
import { Provider } from 'react-redux';
import store from './redux/store';
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <GlobalStyles>
        <GoogleOAuthProvider clientId='821511653841-8pl4t0g613qms41ghjpblgkhaggfluto.apps.googleusercontent.com'>
          <Provider store={store}>
                <App />
          </Provider>
        </GoogleOAuthProvider>
      </GlobalStyles>
  </React.StrictMode>,
);
reportWebVitals();
