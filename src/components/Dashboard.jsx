import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import StateTurns from "./StateTurns";
import { useUser } from "./UserContext";
export default function Dashboard() {
  const { user } = useUser();
  const date = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-content">
        <div className="page-heading">
          <div>
            <span className="eyebrow">TU CONSULTORIO AL DÍA</span>
            <h1>Resumen de la jornada</h1>
            <p className="muted date-label">{date}</p>
          </div>
          <Link className="primary-button" to="/turnos">
            + Agendar turno
          </Link>
        </div>
        <div className="quick-actions">
          <Link to="/turns-patients">
            <span>⌕</span>
            <div>
              <strong>Buscar pacientes</strong>
              <small>Consultá sus turnos y datos</small>
            </div>
            <b>↗</b>
          </Link>
          <Link to="/createPatient">
            <span>+</span>
            <div>
              <strong>Nuevo paciente</strong>
              <small>Sumá un paciente al consultorio</small>
            </div>
            <b>↗</b>
          </Link>
          {Number(user.role_id) === 1 && (
            <Link to="/createDoctor">
              <span>+</span>
              <div>
                <strong>Equipo médico</strong>
                <small>Registrá un nuevo profesional</small>
              </div>
              <b>↗</b>
            </Link>
          )}
        </div>
        <section className="agenda-panel">
          <StateTurns />
        </section>
      </main>
    </div>
  );
}
