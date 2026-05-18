import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminScreen from './screens/AdminScreen/AdminScreen.jsx';
import RaceScreen from './screens/RaceScreen/RaceScreen.jsx';
import './styles/global.css';

function App() {
  const normalizedPath = window.location.pathname.replace('/APP-CARRERAS', '');

  if (normalizedPath.startsWith('/admin')) {
    return <AdminScreen />;
  }

  return <RaceScreen />;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
