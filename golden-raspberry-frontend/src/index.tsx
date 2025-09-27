import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals.ts';

const container = document.getElementById('root');

if (!container) {
    throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(container);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);

reportWebVitals();