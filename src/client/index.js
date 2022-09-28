import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StrictMode } from 'react';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);