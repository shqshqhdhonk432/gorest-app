import React from 'react';
import ReactDOM from 'react-dom/client';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';

import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Theme preset={presetGpnDefault}>
      <App />
    </Theme>
  </React.StrictMode>,
);