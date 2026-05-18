import React from 'react';
import { createRoot } from 'react-dom/client';
import RaceScreen from './screens/RaceScreen/RaceScreen.jsx';
import './styles/global.css';

function App() {
  return <RaceScreen />;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
