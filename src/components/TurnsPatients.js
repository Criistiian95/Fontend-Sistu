import React, { useState } from "react";
import Page from "./Page";
import { api } from "../api";
import AppointmentTable from "./AppointmentTable";
export default function TurnsPatients() {
  const [dni, setDni] = useState("");
  const [patient, setPatient] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function search(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setPatient(null);
    setShifts([]);
    try {
      const data = await api(
        `/api/patient/search?dni=${encodeURIComponent(dni)}`,
      );
      const turns = await api(`/api/shift/patient/${data.patient.DNI}`);
      setPatient(data.patient);
      setShifts(turns);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page
      title="Buscar pacientes"
      subtitle="Encontrá sus datos y turnos por número de documento."
    >
      <section className="form-panel">
        <form className="inline-search record-form" onSubmit={search}>
          <div>
            <label htmlFor="search-dni">DNI del paciente</label>
            <input
              id="search-dni"
              inputMode="numeric"
              pattern="[0-9]{6,12}"
              required
              disabled={busy}
              placeholder="Sin puntos ni espacios"
              value={dni}
              onChange={(e) => {
                setDni(e.target.value);
                setPatient(null);
              }}
            />
          </div>
          <button className="primary-button" disabled={busy}>
            {busy ? "Buscando…" : "Buscar paciente"}
          </button>
        </form>
        {error && (
          <p className="form-alert" role="alert">
            {error}
          </p>
        )}
      </section>
      {patient && (
        <>
          <section className="patient-summary">
            <span className="user-avatar" aria-hidden="true">
              {patient.name[0]}
            </span>
            <div>
              <h2>
                {patient.name} {patient.lastname}
              </h2>
              <p>
                DNI {patient.DNI} · Tel. {patient.phone}
              </p>
              <p>
                {patient.street}, {patient.location}
              </p>
            </div>
          </section>
          <section className="agenda-panel">
            <div className="agenda-heading">
              <h2>Turnos activos</h2>
              <span className="count-badge">{shifts.length} turnos</span>
            </div>
            {shifts.length ? (
              <AppointmentTable
                shifts={shifts}
                onCancel={(id) =>
                  setShifts((list) => list.filter((s) => s.id !== id))
                }
              />
            ) : (
              <p className="empty-state">
                Este paciente no tiene turnos activos.
              </p>
            )}
          </section>
        </>
      )}
    </Page>
  );
}
