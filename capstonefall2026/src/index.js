import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createVolunteerInquiry} from "./mocks/APIClient.ts"

// Opt-in Mock Service Worker bootstrap (PBI-4 AC-3). Disabled by default so
// existing app behavior is unchanged unless REACT_APP_API_MOCKING=enabled.
function enableMocking() {
  if (process.env.NODE_ENV !== 'development' || process.env.REACT_APP_API_MOCKING !== 'enabled') {
    return Promise.resolve();
  }
  return import('./mocks/browser').then(({ worker }) =>
    worker.start({ onUnhandledRequest: 'bypass' })
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Example call using API Client method
  const result = createVolunteerInquiry({firstName: "Jake", lastName: "Schramm", email: "junkemail@yahoo.com", reasonForVolunteering: "Event volunteer"});
  console.log(result);
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
