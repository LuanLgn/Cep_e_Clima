import React from 'react';
import ReactDOM from 'react-dom/client';
// Remova esta linha duplicada:
// import App from './App';  
import App from './App.jsx'; // Esta é a importação correta do seu componente App
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);