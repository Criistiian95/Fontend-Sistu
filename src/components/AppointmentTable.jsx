import React from "react";
import TurnsInfo from "./TurnsInfo";
export default function AppointmentTable({ shifts, onCancel }) {
  return (
    <div
      className="agenda-scroll"
      tabIndex="0"
      role="region"
      aria-label="Listado de turnos"
    >
      <table className="table agenda-table">
        <thead>
          <tr>
            {[
              "Fecha y hora",
              "Paciente",
              "Médico",
              "Especialidad",
              "Observaciones",
              "Acciones",
            ].map((label) => (
              <th key={label} scope="col">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift) => (
            <TurnsInfo key={shift.id} shift={shift} onCancel={onCancel} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
