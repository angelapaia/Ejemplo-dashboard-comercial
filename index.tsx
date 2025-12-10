import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'papaparse'; // Ensure types are loaded if needed by environment, though usually standard import works

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
