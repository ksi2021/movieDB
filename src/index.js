import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/app/app';

const container = document.getElementById('root');

// Create a root.
const root = ReactDOM.createRoot(container);
root.render(<App />);
