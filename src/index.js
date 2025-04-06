import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ExpenseTracker from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ExpenseTracker />
  </React.StrictMode>
);
