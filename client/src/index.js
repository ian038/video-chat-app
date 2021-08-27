import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css'
import { ContextProvider } from './SocketContext'

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

