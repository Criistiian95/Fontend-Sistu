import React, { useState, useEffect } from "react";
import { api } from "../api";
import AppointmentTable from "./AppointmentTable";
export default function StateTurns() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const from = new Date();
    from.setHours(0, 0, 0, 0);
    const to = new Date(from);
    to.setDate(to.getDate() + 1);
    api(
      `/api/shift/estado-turnos?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}`,
      { signal: controller.signal },
    )
      .then(setShifts)
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);
  return (
    <div className="daily-agenda">
      <div className="agenda-heading">
        <div>
          <h2>Turnos de hoy</h2>
          <p className="muted">La atención del día, de un vistazo.</p>
        </div>
        {!loading && !error && (
          <span className="count-badge">{shifts.length} turnos</span>
        )}
      </div>
      {loading ? (
        <p className="empty-state" role="status">
          Cargando la agenda…
        </p>
      ) : error ? (
        <div className="empty-state" role="alert">
          <h3>No pudimos cargar la agenda</h3>
          <p>{error}</p>
          <button
            className="primary-button"
            onClick={() => setAttempt((n) => n + 1)}
          >
            Reintentar
          </button>
        </div>
      ) : shifts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">
            ✓
          </span>
          <h3>La agenda de hoy está libre</h3>
          <p>Los turnos programados para hoy aparecerán acá.</p>
        </div>
      ) : (
        <AppointmentTable
          shifts={shifts}
          onCancel={(id) =>
            setShifts((list) => list.filter((s) => s.id !== id))
          }
        />
      )}
    </div>
  );
}
