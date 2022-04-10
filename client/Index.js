import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { UserProvider } from './UserProvider';



const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <UserProvider>
        <App />
    </UserProvider>
);