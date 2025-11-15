// client/src/main.jsx (Update this file)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // <-- IMPORT REDUX PROVIDER
import store from './store'; // <-- IMPORT REDUX STORE
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap App with Redux Provider */}
    <Provider store={store}> 
      <App />
    </Provider>
  </React.StrictMode>
);