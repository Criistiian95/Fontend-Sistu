import React, { useState } from "react";
import { api } from "../api";
export default function TurnsInfo({ shift, onCancel }) {
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function cancel() {
    setBusy(true);
    setError("");
    try {
      await api(`/api/shift/cambiar-estado/${shift.id}`, { method: "PUT" });
      onCancel(shift.id);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <tr>
      <td>
        {new Intl.DateTimeFormat("es-AR", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(new Date(shift.fecha))}
      </td>
      <td>
        {shift.patient
          ? `${shift.patient.name} ${shift.patient.lastname}`
          : shift.paciente_id}
      </td>
      <td>
        {shift.doctor
          ? `${shift.doctor.name} ${shift.doctor.lastname}`
          : shift.doctor_id}
      </td>
      <td>{shift.specialty?.name || "—"}</td>
      <td>{shift.observaciones || "—"}</td>
      <td>
        {confirm ? (
          <div className="cancel-confirm">
            <span>¿Cancelar este turno?</span>
            <button className="danger-button" disabled={busy} onClick={cancel}>
              {busy ? "Cancelando…" : "Sí, cancelar"}
            </button>
            <button
              className="secondary-button"
              disabled={busy}
              onClick={() => setConfirm(false)}
            >
              Volver
            </button>
          </div>
        ) : (
          <button className="secondary-button" onClick={() => setConfirm(true)}>
            Cancelar turno
          </button>
        )}
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
      </td>
    </tr>
  );
}
