import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./components/Home";
import RegisterUser from "./components/RegisterUser";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import Turnos from "./components/Turnos";
import RegisterPatient from "./components/RegisterPatient";
import RegisterDoctors from "./components/RegisterDoctors";
import TurnsPatients from "./components/TurnsPatients";
import { UserProvider } from "./components/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
export default function App() {
  const protect = (page, admin = false) => (
    <ProtectedRoute admin={admin}>{page}</ProtectedRoute>
  );
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="App">
          <div className="App-header">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Home />} />
              <Route path="/register" element={<RegisterUser />} />
              <Route
                path="/api/user/:userId"
                element={protect(<Dashboard />)}
              />
              <Route path="/turnos" element={protect(<Turnos />)} />
              <Route
                path="/createPatient"
                element={protect(<RegisterPatient />)}
              />
              <Route
                path="/createDoctor"
                element={protect(<RegisterDoctors />, true)}
              />
              <Route
                path="/turns-patients"
                element={protect(<TurnsPatients />)}
              />
              <Route
                path="/doctors"
                element={<Navigate to="/turnos" replace />}
              />
              <Route
                path="*"
                element={
                  <main className="empty-state">
                    <h1>No encontramos esta página</h1>
                    <Link to="/">Volver al inicio</Link>
                  </main>
                }
              />
            </Routes>
            <Footer />
          </div>
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}
