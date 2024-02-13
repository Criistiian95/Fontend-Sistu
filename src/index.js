import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { DoctorProvider } from "./components/DoctorContext.js";
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import { PatientProvider } from './components/PatientContext.js';
import { HorariosProvider } from './components/HorariosContext.js';
import { FechasOcupadasProvider } from './components/FechasContext.js';

import 'bootstrap/dist/css/bootstrap.min.css';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
    <DoctorProvider>
      <PatientProvider>{/* Envuelve tu aplicación con DoctorProvider */}
        <HorariosProvider>
          <FechasOcupadasProvider>
            
            <App />
      
          </FechasOcupadasProvider>
        </HorariosProvider>
      </PatientProvider>
    </DoctorProvider>
  
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
