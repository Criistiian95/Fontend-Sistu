import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home.js"
import RegisterUser from "./components/RegisterUser.js";
import Dashboard from "./components/Dashboard.jsx";
import Footer from "./components/Footer.js"
import Turnos from "./components/Turnos.js";
import RegisterPatient from "./components/RegisterPatient.js"
import RegisterDoctor from "./components/RegisterDoctors.js";
import Doctors from "./components/Doctors.js";
import TurnsPatients from "./components/TurnsPatients.js"

import PrivateRoute from './components/ProtectedRoute.js';








function App() {
  const isAuthenticated = false;
  return (
  
    <div className="App">
      
      <header className="App-header">
      
        <BrowserRouter>

          <Routes className="navbar">
          <Route path="/" element={<Home />} className="lista" />
            <Route path="/login" element={<Home />} className="lista" />
            <Route path="/register" element={<RegisterUser />} className="lista" />
            <Route path="/api/user/:userId" element={isAuthenticated ? < Dashboard /> : <Navigate to="/login" />}/>
            <Route path="/createPatient" element={isAuthenticated ? < RegisterPatient /> : <Navigate to="/login" />}/>
            <Route path="/createDoctor" element={isAuthenticated ? < RegisterDoctor /> : <Navigate to="/login" />}/>
            <Route path="/turns-patients" element={isAuthenticated ? < TurnsPatients /> : <Navigate to="/login" />}/>
            <Route path="/doctors" element={isAuthenticated ? <Doctors  /> : <Navigate to="/login" />}/>
            <Route path="/turnos" element={isAuthenticated ? <Turnos /> : <Navigate to="/login" />} />
          </Routes>
        <Footer/>
        </BrowserRouter>
       
                     
              
      </header>
      
    </div>

  );
}

export default App;
